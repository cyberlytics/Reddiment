import assert from "assert";
import { SimpleCache } from "../src/util/cache";

const defaultKey = "randomKey0123";
const defaultData = { a1: "string property", a2: 42, a3: () => "function property" };

describe("SimpleCache", () => {
    it("should store an item", () => {
        const c = new SimpleCache();
        c.set(defaultKey, defaultData);
        assert.deepStrictEqual(defaultData, c.get<any>(defaultKey));
    });
    it("should return undefined for any other key", () => {
        const c = new SimpleCache();
        c.set(defaultKey, defaultData);
        assert.deepStrictEqual(undefined, c.get<any>("some other key"));
    });
    it("should overwrite data already stored with the same key", () => {
        const c = new SimpleCache();
        const otherData = { test: "test!!!" };
        c.set(defaultKey, defaultData);
        assert.deepStrictEqual(defaultData, c.get<any>(defaultKey));
        c.set(defaultKey, otherData);
        assert.deepStrictEqual(otherData, c.get<any>(defaultKey));
    });
});