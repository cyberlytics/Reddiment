
/**
 * Shorthand function to parse a string into a `Date` object.
 * @param {string} s A string to be parsed as date.
 * @returns {Date} The parsed date as `Date` object.
 */
function date(s: string): Date {
    return new Date(Date.parse(s));
}


export default date;