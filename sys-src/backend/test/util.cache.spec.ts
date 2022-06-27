import assert from "assert";
import { SimpleCache } from "../src/util/cache";

const defaultKey = "randomKey0123";
const defaultData = { a1: "string property", a2: 42, a3: () => "function property" };

describe("SimpleCache", () => {
    it("should store an item", () => {
        const c = new SimpleCache();
        c.set(defaultKey, defaultData);
        assert.deepStrictEqual(c.get<any>(defaultKey), defaultData);
    });
    it("should return undefined for any other key", () => {
        const c = new SimpleCache();
        c.set(defaultKey, defaultData);
        assert.deepStrictEqual(c.get<any>("some other key"), undefined);
    });
    it("should overwrite data already stored with the same key", () => {
        const c = new SimpleCache();
        const otherData = { test: "test!!!" };
        c.set(defaultKey, defaultData);
        assert.deepStrictEqual(c.get<any>(defaultKey), defaultData);
        c.set(defaultKey, otherData);
        assert.deepStrictEqual(c.get<any>(defaultKey), otherData);
    });
});