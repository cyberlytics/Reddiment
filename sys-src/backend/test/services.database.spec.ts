import assert from "assert";
import { ElasticDb } from "../src/services/database";

describe("Elastic Database", () => {
    //Tests Database Connection
    it("Should return True, if Database-Container is running", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.pingElastic();
        assert.deepStrictEqual(result, true);
    });

    // Tests Reddit Comments
    it("should return true on inserting a comment", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.addComment({ subreddit: 'r/123testsubreddit123', sentiment: 1, text: 'the brown fox jumps over the lazy dog', timestamp: new Date(Date.UTC(2022, 5, 13, 10, 30, 0, 0)), articleId: '123articleId', commentId: '123commentID', downvotes: 10, upvotes: 10, userId: '123userId' });
        assert.deepStrictEqual(result, true);
    });

    it("should return true, if the comment was successfully updated", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.addComment({ subreddit: 'r/123testsubreddit123', sentiment: 0.123, text: 'the brown fox jumps over the lazy dog', timestamp: new Date(Date.UTC(2022, 5, 13, 10, 30, 0, 0)), articleId: '123articleId', commentId: '123commentID', downvotes: 10, upvotes: 10, userId: '123userId' });
        assert.deepStrictEqual(result, true);
    });

    it("Should retrun Array with Strings with subreddit names", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.getSubreddits();
        assert.deepStrictEqual(result, ["r/123testsubreddit123"])
    })

    it("Should retrun Array with TimeSentiments", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.getSentiments('r/123testsubreddit123', new Date(Date.UTC(2022, 5, 13, 10, 0, 0, 0)), new Date(Date.UTC(2022, 5, 13, 11, 0, 0, 0)), ['fox']);
        assert.deepStrictEqual(result, [{ time: '2022-06-13T10:30:00.000Z', sentiment: 0.123 }])
    })

    it("should retrun true if the Comment was successfully deleted", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.deleteComment('r/123testsubreddit123')
        assert.deepStrictEqual(result, true);
    })

    //Test financial data
    it("should return true on inserting financial data", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.addFinance({ stock: '123testaktie123', timestamp: new Date(Date.UTC(2022, 5, 17, 11, 30, 0, 0)), open: 100, high: 150, low: 40, close: 1, adjClose: 113, volume: 464732 });
        assert.deepStrictEqual(result, true);
    });

    it("should return true, if the financial data was successfully updated", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.addFinance({ stock: '123testaktie123', timestamp: new Date(Date.UTC(2022, 5, 17, 11, 30, 0, 0)), open: 100, high: 150, low: 40, close: 0, adjClose: 113, volume: 464732 });
        assert.deepStrictEqual(result, true);
    });


    it("Should retrun Array with Strings with stock names", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.getStocks();
        assert.deepStrictEqual(result, ["123testaktie123"])
    })

    it("Should retrun Array with TimeFinance", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.getFinance('123testaktie123', new Date(Date.UTC(2022, 5, 17, 11, 0, 0, 0)), new Date(Date.UTC(2022, 5, 17, 12, 0, 0, 0)));
        assert.deepStrictEqual(result, [{ time: '2022-06-17T11:30:00.000Z', close: 0 }])
    })

    it("should return true, if the financial data was successfully deleted", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.deleteFinance('123testaktie123');
        assert.deepStrictEqual(result, true);
    })

});