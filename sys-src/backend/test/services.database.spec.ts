import assert from "assert";
import { ElasticDb } from "../src/services/database";

describe("Elastic Database", () => {
    it("should return true on inserting a comment", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.addComment({ subreddit: 'r/wallstreetbets', sentiment: 1, text: 'the brown fox jumps over the lazy dog', timestamp: new Date(Date.UTC(2022,5,13,10,30,0,0)) });
        assert.deepStrictEqual(result, true);
    });

    it("Should return True, if Database-Container is running", async () => {
        const db = new ElasticDb(s => null);
        const result = await db.pingElastic();
        assert.deepStrictEqual(result,true);
    });

    it("Should retrun Array with Strings", async () => {
        const db = new ElasticDb (s => null);
        const result = await db.getSubreddits();
        assert.deepStrictEqual(result, [ "r/wallstreetbets"])
    })

    it("Should retrun Array with TimeSentiments", async () => {
        const db = new ElasticDb (s => null);
        const result = await db.getSentiments('r/wallstreetbets', new Date(Date.UTC(2022,5,13,10,0,0,0)), new Date(Date.UTC(2022,5,13,11,0,0,0)), ['fox']);
        assert.deepStrictEqual(result, [{time:'2022-06-13T10:30:00.000Z',sentiment:1}])
    })

});