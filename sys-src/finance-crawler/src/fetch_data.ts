
import yahooFinance from 'yahoo-finance2';
import { formatDate } from './utils';
import { verifyTicker } from './utils';
import { deliverTickerData, tickerJobs } from './connection';
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
    // set startDate to the current date minus one day
    let startDate: string = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));
    // set startdate if given from ticker
    if (ticker.startDate) {
        startDate = ticker.startDate;
    }
    // set endDate to the current date
    let endDate: string = formatDate(new Date());
    // set endDate if given from ticker
    if (ticker.endDate) {
        endDate = ticker.endDate;
    }
    else {

    }
    if (verifyTicker(ticker.name)) {
        // options for api call
        const options: any = { period1: startDate, period2: endDate, interval: '1d' };
        const results = await yahooFinance.historical(ticker.name, options);
        console.log(results);

        // fill in tickerResults for each day in results
        const tickerResults: tickerResult[] = [];
        for (const i in results) {
            const tickerResult: tickerResult = {
                name: ticker.name,
                date: formatDate(results[i].date),
                open: results[i].open,
                high: results[i].high,
                low: results[i].low,
                close: results[i].close,
                volume: results[i].volume
            }
            // return response to backend
            await deliverTickerData(tickerResults);
        };


    }
};

const crawlStocks = async () => {
    try {
        // get ticker names from backend
        const ticker = tickerJobs.pop();
        console.log("found ticker: %d", ticker);

        if (!ticker) {
            console.log("no ticker")
            return
        }
        let exists = Object.values(ticker).includes("name");
        if (!exists) {
            console.log("no name")
            return
        }

        await getStockData(ticker);

    } catch (error) {

        console.log("catched error: %d", error);
    }
}


setTimeout(crawlStocks, 60 * 60 * 1000); // every 60 minutes