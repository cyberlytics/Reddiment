import assert from "assert";
import { date, daynumber } from "../src/util/time";

describe("time", () => {
    it("should parse a date", () => {
        assert.deepStrictEqual(
            new Date(Date.parse("2022-05-01T00:00:00Z")),
            date("2022-05-01T00:00:00Z"));
    });

    it("should return the correct day number", () => {
        assert.deepStrictEqual(
            daynumber(date("1970-01-01T00:00:00Z")),
            0);

        assert.deepStrictEqual(
            daynumber(date("1970-01-01T23:59:59Z")),
            0);

        assert.deepStrictEqual(
            daynumber(date("2022-06-18T12:00:00Z")),
            19161);
    });
});