import assert from "assert";
import { ElasticDb } from "../src/services/database";

describe("Elastic Database", () => {
    it("should return true on inserting a comment", async () => {
        const db = new ElasticDb();
        const result = await db.addComment({ subreddit: 'r/test', sentiment: 1, text: 'Hallo', timestamp: new Date() });
        assert.deepStrictEqual(result, true);
    });

    it("Should return True, if Database-Container is running", async () => {
        const db = new ElasticDb();
        const result = await db.pingElastic();
        assert.deepStrictEqual(result,true);
    });
});