import assert from "assert";
import date from "../src/util/time";

describe("time", () => {
    it("should parse a date", () => {
        assert.deepStrictEqual(
            date("2022-05-01T00:00:00Z"),
            new Date(Date.parse("2022-05-01T00:00:00Z")));
    });
});