"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../src/utils");
it('padTo2Digits should return a string with 2 digits for any given number', () => {
    expect((0, utils_1.padTo2Digits)(1)).toBe('01');
    expect((0, utils_1.padTo2Digits)(10)).toBe('10');
    expect((0, utils_1.padTo2Digits)(100)).toBe('100');
    expect((0, utils_1.padTo2Digits)(0)).toBe('00');
});
it('formatDate should return a string with the format YYYY-MM-DD', () => {
    expect((0, utils_1.formatDate)(new Date(2020, 1, 1))).toBe('2020-01-01');
    expect((0, utils_1.formatDate)(new Date(1020, 2, 12))).toBe('1020-02-12');
});
it('verifyTicker should return true if the ticker is a string with lengths 3 and 4 and only uppercase letters', () => {
    expect((0, utils_1.verifyTicker)('TE')).toBe(false);
    expect((0, utils_1.verifyTicker)('TES')).toBe(true);
    expect((0, utils_1.verifyTicker)('TEST')).toBe(true);
    expect((0, utils_1.verifyTicker)('TESTT')).toBe(false);
    expect((0, utils_1.verifyTicker)('TESTTEST')).toBe(false);
    expect((0, utils_1.verifyTicker)('TESTTESTT')).toBe(false);
});
