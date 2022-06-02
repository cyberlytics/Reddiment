import { ApolloServer } from "apollo-server-express";
import assert from "assert";
import { contextFunctionForMock, createApolloServer } from "../src/server.apollo";
import date from "../src/util/time";

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

    it("should save a comment and can retrieve its sentiment afterwards.", async () => {
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

    it("should reject a comment if the sentiment service is unavailable (or in debug mode: string 'reject' is sent).", async () => {
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
});

