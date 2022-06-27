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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
const utils_1 = require("./utils");
const utils_2 = require("./utils");
const connection_1 = require("./connection");
const getStockData = (ticker) => __awaiter(void 0, void 0, void 0, function* () {
    // get daily values between startDate and endDate of given ticker
    if (!ticker) {
        // return error if ticker is not set
        // raise error if ticker is not valid
        return {
            error: 'Ticker is not set'
        };
    }
    // check if req has field date
    if (!ticker.startDate) {
        // throw error
        return {
            error: 'Start date is not set'
        };
    }
    // set startDate to the current date minus one day
    let startDate = (0, utils_1.formatDate)(new Date(new Date().setDate(new Date().getDate() - 1)));
    // set startdate if given from ticker
    if (ticker.startDate) {
        startDate = ticker.startDate;
    }
    // set endDate to the current date
    let endDate = (0, utils_1.formatDate)(new Date());
    // set endDate if given from ticker
    if (ticker.endDate) {
        endDate = ticker.endDate;
    }
    else {
    }
    if ((0, utils_2.verifyTicker)(ticker.name)) {
        // options for api call
        const options = { period1: startDate, period2: endDate, interval: '1d' };
        const results = yield yahoo_finance2_1.default.historical(ticker.name, options);
        console.log(results);
        // fill in tickerResults for each day in results
        const tickerResults = [];
        for (const i in results) {
            const tickerResult = {
                name: ticker.name,
                date: (0, utils_1.formatDate)(results[i].date),
                open: results[i].open,
                high: results[i].high,
                low: results[i].low,
                close: results[i].close,
                volume: results[i].volume
            };
            // return response to backend
            (0, connection_1.deliverTickerData)(tickerResults);
        }
        ;
    }
});
const crawlStocks = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get ticker names from backend
        const ticker = connection_1.tickerJobs.pop();
        if (ticker) {
            yield getStockData(ticker);
        }
    }
    catch (error) {
        console.log(error);
    }
});
setTimeout(crawlStocks, 60 * 60 * 1000); // every 60 minutes
