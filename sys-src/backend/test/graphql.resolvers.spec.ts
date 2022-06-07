import { ApolloServer } from "apollo-server-express";
import assert from "assert";
import { contextFunctionForMock, createApolloServer } from "../src/server.apollo";

describe("Apollo Server GraphQL API", () => {
    let apolloServer: ApolloServer;
    before(() => {
        apolloServer = createApolloServer([], contextFunctionForMock);
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
        assert.deepStrictEqual(s.time, timestamp);
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
});

