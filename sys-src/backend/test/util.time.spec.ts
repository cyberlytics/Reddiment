import assert from "assert";
import date from "../src/util/time";

describe("time", () => {
    it("should parse a date", () => {
        assert.deepStrictEqual(
            new Date(Date.parse("2022-05-01T00:00:00Z")),
            date("2022-05-01T00:00:00Z"));
    });
});