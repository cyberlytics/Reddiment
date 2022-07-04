import { ApolloServer } from "apollo-server-express";
import assert from "assert";
import { contextFunctionForMock, createApolloServer } from "../src/server.apollo";
import { date, daynumber, MillisecondsPerDay } from "../src/util/time";

describe("Apollo Server GraphQL API", () => {
    let apolloServer: ApolloServer;
    before(async () => {
        apolloServer = await createApolloServer([], contextFunctionForMock);
    });
    after(async () => {
        await apolloServer?.stop();
    });

    it("should return two subreddit names (default data)", async () => {
        const result = await apolloServer.executeOperation({
            query: 'query GetSubredditNames { subreddits }'
        });
        assert.strictEqual(result.errors, undefined);
        assert.deepStrictEqual(result.data?.subreddits, ["r/wallstreetbets", "r/place"]);
    });

    it("should save a comment and can retrieve its sentiment afterwards", async () => {
        const demoSubreddit = "r/test" + new Date().valueOf();
        const timestamp = new Date().toISOString();

        const result1 = await apolloServer.executeOperation({
            query: 'mutation add($comment: Comment!) { addComment(comment: $comment) }',
            variables: {
                comment: {
                    subredditName: demoSubreddit,
                    text: "pink fluffy unicorns dancing on rainbows",
                    timestamp: timestamp,
                    commentId: "0123456789",
                    userId: "abcdef",
                    articleId: "ZYXWVU",
                }
            }
        });

        assert.strictEqual(result1.errors, undefined);
        assert.deepStrictEqual(result1.data?.addComment, true);

        const result2 = await apolloServer.executeOperation({
            query: 'query get($name: String!) { subreddit(nameOrUrl: $name) { name, sentiment(keywords: []) { time, positive, negative, neutral, sum } } }',
            variables: {
                name: demoSubreddit,
            }
        });

        assert.strictEqual(result2.errors, undefined);
        assert.deepStrictEqual(result2.data?.subreddit?.name, demoSubreddit);
        assert.deepStrictEqual(result2.data?.subreddit?.sentiment?.length, 1);
        const s = result2.data.subreddit.sentiment[0]!;
        assert.deepStrictEqual(s.time, new Date(daynumber(date(timestamp)) * MillisecondsPerDay).toISOString());
        assert.deepStrictEqual(s.positive + s.negative + s.neutral, 1);
        assert.deepStrictEqual(s.sum, 1);
        assert.deepStrictEqual(s.positive === 0 || s.positive === 1, true);
        assert.deepStrictEqual(s.negative === 0 || s.negative === 1, true);
        assert.deepStrictEqual(s.neutral === 0 || s.neutral === 1, true);
    });

    it("should reject a comment if the sentiment service is unavailable (or in debug mode: string 'reject' is sent)", async () => {
        const demoSubreddit = "r/test" + new Date().valueOf();
        const timestamp = new Date().toISOString();

        const result1 = await apolloServer.executeOperation({
            query: 'mutation add($comment: Comment!) { addComment(comment: $comment) }',
            variables: {
                comment: {
                    subredditName: demoSubreddit,
                    text: "reject",
                    timestamp: timestamp,
                    commentId: "0123456789",
                    userId: "abcdef",
                    articleId: "ZYXWVU",
                }
            }
        });

        assert.strictEqual(result1.errors, undefined);
        assert.deepStrictEqual(result1.data?.addComment, false);

        const result2 = await apolloServer.executeOperation({
            query: 'query get($name: String!) { subreddit(nameOrUrl: $name) { name, sentiment(keywords: []) { time, positive, negative, neutral, sum } } }',
            variables: {
                name: demoSubreddit,
            }
        });

        assert.strictEqual(result2.errors, undefined);
        assert.deepStrictEqual(result2.data?.subreddit?.name, undefined); // Subreddit does not exist because no comment was added
        assert.deepStrictEqual(result2.data?.subreddit?.sentiment, undefined);
    });

    it("should save comments and allow keyword queries afterwards", async () => {
        const demoSubreddit = "r/test" + new Date().valueOf();
        const timestamp = new Date().toISOString();

        const addComment = async (text: string) => {
            const result = await apolloServer.executeOperation({
                query: 'mutation add($comment: Comment!) { addComment(comment: $comment) }',
                variables: {
                    comment: {
                        subredditName: demoSubreddit,
                        text: text,
                        timestamp: timestamp,
                        commentId: "0123456789",
                        userId: "abcdef",
                        articleId: "ZYXWVU",
                    }
                }
            });

            assert.strictEqual(result.errors, undefined);
            assert.deepStrictEqual(result.data?.addComment, true);
        };

        const retrieveSentiment = async (expectedCount: number, ...keywords: Array<string>) => {
            const result = await apolloServer.executeOperation({
                query: 'query get($name: String!, $keywords: [String!]!) { subreddit(nameOrUrl: $name) { name, sentiment(keywords: $keywords, from: "2022-01-01", to: "2999-12-31") { time, positive, negative, neutral, sum } } }',
                variables: {
                    name: demoSubreddit,
                    keywords: keywords,
                }
            });

            assert.strictEqual(result.errors, undefined);
            if (expectedCount > 0) {
                assert.deepStrictEqual(result.data?.subreddit?.name, demoSubreddit);
                assert.deepStrictEqual(result.data?.subreddit?.sentiment?.length, 1);
                const s = result.data.subreddit.sentiment[0];
                assert.deepStrictEqual(s.sum, expectedCount);
            }
            else {
                assert.deepStrictEqual(result.data?.subreddit?.name, demoSubreddit);
                assert.deepStrictEqual(result.data?.subreddit?.sentiment?.length, 0);
            }
        };

        addComment("Never gonna give you up");
        addComment("All Star");
        addComment("Shooting Star");
        addComment("Let it grow");
        addComment("Let it go");
        addComment("Gangnam Style");
        addComment("Crab rave");


        retrieveSentiment(2, "Star");
        retrieveSentiment(2, "Let");
        retrieveSentiment(2, "it");
        retrieveSentiment(1, "Style");
        retrieveSentiment(0, "Pink");
    });

    it("should fail if an invalid date is supplied", async () => {
        const demoSubreddit = "r/test" + new Date().valueOf();
        const timestamp = new Date().toISOString();

        const resultInvalid = await apolloServer.executeOperation({
            query: 'query get($name: String!) { subreddit(nameOrUrl: $name) { name, sentiment(keywords: [], from: 123) { time, positive, negative, neutral, sum } } }',
            variables: {
                name: demoSubreddit,
            }
        });

        assert.strictEqual(resultInvalid.errors?.length, 1);
    });

    it("should return the service status", async () => {
        const result = await apolloServer.executeOperation({
            query: 'query GetServiceHealth { health { name, status, lastConnect } }'
        });
        assert.strictEqual(result.errors, undefined);
        assert.deepStrictEqual(result.data?.health?.length, 1);

        const db = result.data.health.find((h: any) => h.name == 'database');
        assert.deepStrictEqual(db.status, "UP");
    });

    it("should return some jobs", async () => {
        const result = await apolloServer.executeOperation({
            query: 'query GetJobs { jobs }'
        });
        assert.strictEqual(result.errors, undefined);
        assert.deepStrictEqual(result.data?.jobs?.length, 1);

        assert.deepStrictEqual(result.data.jobs[0], "r/wallstreetbets");
    });


    it("should group the queried sentiments by date", async () => {
        const demoSubreddit = "r/test" + new Date().valueOf();

        const addComment = async (text: string, timestamp: Date) => {
            const result = await apolloServer.executeOperation({
                query: 'mutation add($comment: Comment!) { addComment(comment: $comment) }',
                variables: {
                    comment: {
                        subredditName: demoSubreddit,
                        text: text,
                        timestamp: timestamp.toISOString(),
                        commentId: "0123456789",
                        userId: "abcdef",
                        articleId: "ZYXWVU",
                    }
                }
            });

            assert.strictEqual(result.errors, undefined);
            assert.deepStrictEqual(result.data?.addComment, true);
        };

        const retrieveSentiments = async (expected: Array<{ date: Date, sum: number }>) => {
            const result = await apolloServer.executeOperation({
                query: 'query get($name: String!, $keywords: [String!]!) { subreddit(nameOrUrl: $name) { name, sentiment(keywords: $keywords) { time, positive, negative, neutral, sum } } }',
                variables: {
                    name: demoSubreddit,
                    keywords: new Array<string>(),
                }
            });

            assert.strictEqual(result.errors, undefined);
            if (expected.length > 0) {
                assert.deepStrictEqual(result.data?.subreddit?.name, demoSubreddit);
                assert.deepStrictEqual(result.data?.subreddit?.sentiment?.length, expected.filter(e => e.sum > 0).length);

                expected.forEach((e) => {
                    const filtered = result!.data!.subreddit.sentiment.filter((s: any) => s.time === e.date.toISOString());
                    if (e.sum > 0) {
                        assert.deepStrictEqual(filtered.length, 1);
                        assert.deepStrictEqual(filtered[0].sum, e.sum);
                    }
                    else {
                        assert.deepStrictEqual(filtered.length, 0);
                    }
                });
            }
            else {
                assert.deepStrictEqual(result.data?.subreddit?.name, demoSubreddit);
                assert.deepStrictEqual(result.data?.subreddit?.sentiment?.length, 0);
            }
        };

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < (1 + 5 * i) % 7; j++) {
                const randomHour = Math.floor(Math.random() * 24).toLocaleString('en-US', { minimumIntegerDigits: 2 });
                const randomMinute = Math.floor(Math.random() * 60).toLocaleString('en-US', { minimumIntegerDigits: 2 });
                const randomSecond = Math.floor(Math.random() * 60).toLocaleString('en-US', { minimumIntegerDigits: 2 });
                const d = date(`2022-06-${10 + i}T${randomHour}:${randomMinute}:${randomSecond}Z`);
                await addComment(`Some blue flowers yield a lot of wine ${j}`, d);
            }
        }


        retrieveSentiments([
            { date: date("2022-06-10T00:00:00Z"), sum: 1 },
            { date: date("2022-06-11T00:00:00Z"), sum: 6 },
            { date: date("2022-06-12T00:00:00Z"), sum: 4 },
            { date: date("2022-06-13T00:00:00Z"), sum: 2 },
            { date: date("2022-06-14T00:00:00Z"), sum: 0 },
            { date: date("2022-06-15T00:00:00Z"), sum: 5 },
            { date: date("2022-06-16T00:00:00Z"), sum: 3 },
            { date: date("2022-06-17T00:00:00Z"), sum: 1 },
            { date: date("2022-06-18T00:00:00Z"), sum: 6 },
            { date: date("2022-06-19T00:00:00Z"), sum: 4 },
        ]);
    });



    it("should return one stock name (default data)", async () => {
        const result = await apolloServer.executeOperation({
            query: 'query GetStockNames { stocks }'
        });
        assert.strictEqual(result.errors, undefined);
        assert.deepStrictEqual(result.data?.stocks, ["VW"]);
    });

    it("should return a previously added stock", async () => {
        const demoStock = "ACME" + new Date().valueOf();
        const timestamp = new Date().toISOString();

        const result1 = await apolloServer.executeOperation({
            query: 'mutation add($stock: RawStock!) { addStock(stock: $stock) }',
            variables: {
                stock: {
                    stockName: demoStock,
                    date: timestamp,
                    open: 123.45,
                    close: 234.56,
                    volume: 1e100,
                    high: 456.78,
                    low: 12.34,
                },
            },
        });

        assert.strictEqual(result1.errors, undefined);
        assert.deepStrictEqual(result1.data?.addStock, true);

        const result2 = await apolloServer.executeOperation({
            query: 'query get($name: String!) { stock(name: $name) { name, values { time, close } } }',
            variables: {
                name: demoStock,
            }
        });

        assert.strictEqual(result2.errors, undefined);
        assert.deepStrictEqual(result2.data?.stock?.name, demoStock);
        assert.deepStrictEqual(result2.data?.stock?.values?.length, 1);
        const s = result2.data.stock.values[0]!;
        assert.deepStrictEqual(s.time, new Date(daynumber(date(timestamp)) * MillisecondsPerDay).toISOString());
        assert.deepStrictEqual(s.close, 234.56);
    });

    it("should return null if an invalid name is supplied", async () => {
        const demoStock = "ACME" + new Date().valueOf();

        const resultInvalid = await apolloServer.executeOperation({
            query: 'query get($name: String!) { stock(name: $name) { name, values { time, close } } }',
            variables: {
                name: demoStock,
            }
        });

        assert.strictEqual(resultInvalid.errors, undefined);
        assert.strictEqual(resultInvalid.data?.stock, null);
    });

    it("should return a previously added stock if it is in the date interval", async () => {
        const demoStock = "ACME" + new Date().valueOf();
        const addStock = async (timestamp: Date, close: number) => {
            const result = await apolloServer.executeOperation({
                query: 'mutation add($stock: RawStock!) { addStock(stock: $stock) }',
                variables: {
                    stock: {
                        stockName: demoStock,
                        date: timestamp.toISOString(),
                        open: 123.45,
                        close: close,
                        volume: 1e100,
                        high: 456.78,
                        low: 12.34,
                    },
                },
            });
            assert.strictEqual(result.errors, undefined);
            assert.deepStrictEqual(result.data?.addStock, true);
        };

        const retrieveStock = async (from?: Date, to?: Date, closes?: Array<number>) => {
            const result = await apolloServer.executeOperation({
                query: 'query get($name: String!, $from: Date, $to: Date) { stock(name: $name) { name, values(from: $from, to: $to) { time, close } } }',
                variables: {
                    name: demoStock,
                    from: from?.toISOString() ?? null,
                    to: to?.toISOString() ?? null,
                }
            });
            assert.strictEqual(result.errors, undefined);
            assert.deepStrictEqual(result.data?.stock?.name, demoStock);
            closes = closes ?? new Array<number>();
            if (closes.length > 0) {
                assert.deepStrictEqual(result.data?.stock?.values?.length, closes.length);
                result.data.stock.values.forEach((v: any, i: number) => {
                    assert.ok((date(v.time) >= (from ?? date("1900-01-01"))) && (date(v.time) <= (to ?? date("2099-12-31"))))
                    assert.deepStrictEqual(v.close, closes![i]);
                });
            }
        };

        await addStock(date("2022-06-20T00:00:00Z"), 100);
        await addStock(date("2022-06-21T00:00:00Z"), 150);
        await addStock(date("2022-06-22T00:00:00Z"), 200);
        await addStock(date("2022-06-23T00:00:00Z"), 250);

        await retrieveStock(undefined, undefined, [100, 150, 200, 250]);
        await retrieveStock(date("2022-06-21T00:00:00Z"), undefined, [150, 200, 250]);
        await retrieveStock(date("2022-06-21T00:00:00Z"), date("2022-06-22T00:00:00Z"), [150, 200]);
    });
});

