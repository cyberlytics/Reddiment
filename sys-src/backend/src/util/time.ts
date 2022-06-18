
/**
 * Shorthand function to parse a string into a `Date` object.
 * @param {string} s A string to be parsed as date.
 * @returns {Date} The parsed date as `Date` object.
 */
function date(s: string): Date {
    return new Date(Date.parse(s));
}


const MillisecondsPerDay = 1000 * 60 * 60 * 24;

/**
 * Assigns each `Date` object the number of days since January 1st, 1970.
 * @param {Date} d A `Date` object
 * @returns {number} The day number since January 1st, 1970.
 */
function daynumber(d: Date): number {
    return Math.floor(d.valueOf() / MillisecondsPerDay);
}


export { date, daynumber, MillisecondsPerDay };