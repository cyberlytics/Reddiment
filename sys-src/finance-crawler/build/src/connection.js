"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverTickerData = exports.tickerJobs = void 0;
// backendurl to get the tickers and send the reuslts to.
const BackendURL = `http://${process.env.BACKEND_ADDR}/graphql`;
// define a variable to store the current tickers as a list of tickerJob
exports.tickerJobs = [];
// fill in format of tickerResult and send it to backend
function deliverTickerData(results) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const i in results) {
                const resp = yield fetch(BackendURL, {
                    method: 'POST',
                    body: JSON.stringify({
                        query: "mutation AddTicker($ticker: Ticker!) {addTicker(ticker: $ticker)}",
                        variables: {
                            ticker: {
                                name: results[i].name,
                                date: results[i].date,
                                open: results[i].open,
                                high: results[i].high,
                                low: results[i].low,
                                close: results[i].close,
                                volume: results[i].volume
                            }
                        },
                        operationName: 'addTicker'
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            }
            ;
        }
        catch (error) {
            console.log(error);
        }
        ;
    });
}
exports.deliverTickerData = deliverTickerData;
// funciton to add a ticker to the list of tickers
function addTicker() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield fetch(BackendURL, {
                method: 'post',
                body: JSON.stringify({
                    query: "query GetJobs { jobs }",
                    operationName: "GetJobs"
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const obj = yield result.json();
            const tickersToGet = ((_b = (_a = obj === null || obj === void 0 ? void 0 : obj.data) === null || _a === void 0 ? void 0 : _a.jobs) !== null && _b !== void 0 ? _b : []);
            for (const i in tickersToGet) {
                // check if jobs already exists
                const foundItems = exports.tickerJobs.filter(item => item.name === tickersToGet[i].slice(2));
                if (foundItems.length !== 0)
                    continue;
                const currentTicker = {
                    name: tickersToGet[i].name,
                    startDate: tickersToGet[i].startDate,
                    endDate: tickersToGet[i].endDate
                };
                exports.tickerJobs.push(currentTicker);
            }
        }
        catch (error) {
            console.log('error', error);
        }
    });
}
setTimeout(addTicker, 60 * 60 * 1000); // every hour
