import assert from "assert";
import { aggregate, distinct, groupby } from "../src/util/list";

describe("List.distinct", () => {
    it("should return all unique values", () => {
        const list1 = ['first', 'second', 'third'];
        const list2 = ['first', 'second', 'third', 'second', 'second', 'third'];

        assert.deepStrictEqual(distinct(list2), list1);
    });
});

describe("List.groupby", () => {
    it("should group by the a property", () => {
        const list = [
            { p: 0, s: "a" },
            { p: 0, s: "b" },
            { p: 0, s: "c" },
            { p: 1, s: "x" },
            { p: 1, s: "y" },
            { p: 2, s: "5" },
        ];
        const map = new Map<number, any[]>();
        map.set(0, [
            { p: 0, s: "a" },
            { p: 0, s: "b" },
            { p: 0, s: "c" },
        ]);
        map.set(1, [
            { p: 1, s: "x" },
            { p: 1, s: "y" },
        ]);
        map.set(2, [
            { p: 2, s: "5" }
        ]);

        assert.deepStrictEqual(groupby(list, l => l.p), map);
    });

    it("should group by the whole object", () => {
        const list = ['first', 'second', 'third', 'second', 'second', 'third'];
        const map = new Map<string, string[]>();
        map.set('first', ['first']);
        map.set('second', ['second', 'second', 'second']);
        map.set('third', ['third', 'third']);

        assert.deepStrictEqual(groupby(list, l => l), map);
    });
});

describe("List.aggregate", () => {
    it("should aggregate a single group", () => {
        const data = new Map<number, number[]>();
        data.set(0, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        assert.deepStrictEqual(aggregate(data, _ => 0, (p, c) => p + c).get(0), 55);
    });

    it("should aggregate multiple groups", () => {
        const data = new Map<number, number[]>();
        data.set(0, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        data.set(1, [-1, 2, -3, 4, -5, 6, -7, 8, -9, 10]);

        const agg = aggregate(data, n => 0, (p, c) => p + c);
        assert.deepStrictEqual(agg.get(0), 55);
        assert.deepStrictEqual(agg.get(1), 5);
    });

    it("should ignore a group containing of no elements", () => {
        const data = new Map<number, number[]>();
        data.set(0, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        data.set(1, [-1, 2, -3, 4, -5, 6, -7, 8, -9, 10]);
        data.set(2, []); // Empty!

        const agg = aggregate(data, n => 0, (p, c) => p + c);
        assert.deepStrictEqual(agg.get(0), 55);
        assert.deepStrictEqual(agg.get(1), 5);
        assert.deepStrictEqual(agg.has(2), false);
    });
});
