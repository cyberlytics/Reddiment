
/**
 * Modified from https://stackoverflow.com/a/35092559
 * @param {T[]} list A list of objects that can be contained in that list multiple times.
 * @returns A list of objects where each object is contained in that list exactly once.
 */
function distinct<T>(list: T[]): T[] {
    return [...new Set(list)];
}

/**
 * Groups elements of the same type based on a property defined in ``selector`` function.
 * @param {T[]} list A list of objects.
 * @param {(obj: T) => P} selector A function to map any object to a property to be grouped by.
 * @returns A `Map<P, T[]>` grouping all objects by the given property.
 */
function groupby<T, P>(list: T[], selector: (obj: T) => P): Map<P, T[]> {
    const r = new Map<P, T[]>();
    list.forEach(obj => {
        const s = selector(obj);
        if (!r.has(s)) r.set(s, []);
        r.get(s)!.push(obj);
    });
    return r;
}

/**
 * Aggregates a previously grouped list of elements.
 * @param {Map<P, T[]>} groupedList A previously grouped list of elements. See `groupby` function.
 * @param {(obj: T) => R} initFunc An aggregation initializer function.
 * @param {(previous: R, current: T) => R} aggregation An aggregation function.
 * @returns {Map<P, R>} A `Map<P, R>` containing all aggregated values grouped by ``P``.
 */
function aggregate<T, P, R>(groupedList: Map<P, T[]>, initFunc: (obj: T) => R, aggregation: (previous: R, current: T) => R): Map<P, R> {
    const result = new Map<P, R>();
    groupedList.forEach((values, k) => {
        if (values.length > 0) {
            result.set(k, values.reduce(aggregation, initFunc(values[0])));
        }
    });
    return result;
}


export { distinct, groupby, aggregate };
