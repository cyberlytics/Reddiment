
import yahooFinance from 'yahoo-finance2';
import { verifyTicker } from './utils';
import { deliverTickerData, tickerJobs, addTicker } from './connection';
import { tickerJob, tickerResult } from './types';

const getStockData = async (ticker: tickerJob) => {
    // get daily values between startDate and endDate of given ticker

    if (!ticker) {
        // return error if ticker is not set
        // raise error if ticker is not valid
        return {
            error: 'Ticker is not set'
        }
    }
    // check if req has field date
    if (!ticker.startDate) {
        // throw error
        return {
            error: 'Start date is not set'
        }
    }

    if (verifyTicker(ticker.name)) {
        // options for api call
        const options: any = { period1: ticker.startDate, period2: ticker.endDate, interval: '1d' };
        const results = await yahooFinance.historical(ticker.name, options);

        // fill in tickerResults for each day in results
        const tickerResults: tickerResult[] = [];
        for (const i in results) {
            const tickerResult: tickerResult = {
                name: ticker.name,
                date: results[i].date.toISOString(),
                open: results[i].open,
                high: results[i].high,
                low: results[i].low,
                close: results[i].close,
                volume: results[i].volume
            };
            tickerResults.push(tickerResult);
        };
        await deliverTickerData(tickerResults);
    }
};

const crawlStocks = async () => {
    try {
        console.log('crawling stocks');
        console.log(tickerJobs);
        // check if there are tickers to crawl
        if (tickerJobs.length === 0) {
            addTicker();
        }
        if (tickerJobs.length > 0) {
            for (const i in tickerJobs) {
                // get ticker names from backend
                const ticker = tickerJobs.pop();

                if (ticker) {
                    console.log("found ticker:", ticker?.name);
                    if (typeof ticker?.name !== 'undefined') {
                        await getStockData(ticker);
                    }
                }
            }
        }

    } catch (error) {
        console.log("catched error:", error);
    };
};


setTimeout(crawlStocks, 10 * 1000); // Start in 10 Seconds
setInterval(crawlStocks, 10 * 60 * 1000); // Every 10 minutes