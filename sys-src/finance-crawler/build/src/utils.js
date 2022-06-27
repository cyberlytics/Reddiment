"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padTo2Digits = exports.verifyTicker = exports.formatDate = void 0;
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
exports.padTo2Digits = padTo2Digits;
function formatDate(date) {
    return ([
        date.getFullYear(),
        padTo2Digits(date.getMonth()),
        padTo2Digits(date.getDate()),
    ]).join('-');
}
exports.formatDate = formatDate;
;
function verifyTicker(ticker) {
    // check if ticker exists
    if (!ticker) {
        return false;
    }
    if (ticker.length >= 5) {
        return false;
    }
    if (ticker.length < 3) {
        return false;
    }
    return true;
}
exports.verifyTicker = verifyTicker;
