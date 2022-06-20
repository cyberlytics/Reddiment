import assert from "assert";
import { ElasticDb } from "../src/services/database";

describe("Elastic Database", () => {
    // Tests Reddit Comments
    it("should return true on inserting or updating a comment", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.addComment({ subreddit: 'r/wallstreetbets', sentiment: 1, text: 'the brown fox jumps over the lazy dog', timestamp: new Date(Date.UTC(2022, 5, 13, 10, 30, 0, 0)), articleId: '', commentId: '', downvotes: 0, upvotes: 0, userId: '' });
        assert.deepStrictEqual(result, true);
    });

    it("Should return True, if Database-Container is running", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.pingElastic();
        assert.deepStrictEqual(result, true);
    });

    it("Should retrun Array with Strings with subreddit names", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.getSubreddits();
        assert.deepStrictEqual(result, ["r/wallstreetbets"])
    })

    it("Should retrun Array with TimeSentiments", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.getSentiments('r/wallstreetbets', new Date(Date.UTC(2022, 5, 13, 10, 0, 0, 0)), new Date(Date.UTC(2022, 5, 13, 11, 0, 0, 0)), ['fox']);
        assert.deepStrictEqual(result, [{ time: '2022-06-13T10:30:00.000Z', sentiment: 1 }])
    })

    //Test financial data
    it("should return true on inserting or updating financial data", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.addFinance({ aktie: '123testaktie123', timestamp: new Date(Date.UTC(2022, 5, 17, 11, 30, 0, 0)), open: 100, high: 150, low: 40, close: 112, adjClose: 113, volume: 464732 });
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
        assert.deepStrictEqual(result, [{ time: '2022-06-17T11:30:00.000Z', close: 112 }])
    })

});