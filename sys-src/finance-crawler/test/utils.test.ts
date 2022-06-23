

import { padTo2Digits, formatDate, verifyTicker } from '../src/utils';


it('padTo2Digits should return a string with 2 digits for any given number', () => {
    expect(padTo2Digits(1)).toBe('01');
    expect(padTo2Digits(10)).toBe('10');
    expect(padTo2Digits(100)).toBe('100');
    expect(padTo2Digits(0)).toBe('00');
});

it('formatDate should return a string with the format YYYY-MM-DD', () => {
    expect(formatDate(new Date(2020, 1, 1))).toBe('2020-01-01');
    expect(formatDate(new Date(1020, 2, 12))).toBe('1020-02-12');
});

it('verifyTicker should return true if the ticker is a string with lengths 3 and 4 and only uppercase letters', () => {
    expect(verifyTicker('TE')).toBe(false);
    expect(verifyTicker('TES')).toBe(true);
    expect(verifyTicker('TEST')).toBe(true);
    expect(verifyTicker('TESTT')).toBe(false);
    expect(verifyTicker('TESTTEST')).toBe(false);
    expect(verifyTicker('TESTTESTT')).toBe(false);
});