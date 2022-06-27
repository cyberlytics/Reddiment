
import yahooFinance from 'yahoo-finance2';
import { formatDate } from './utils';
import { verifyTicker } from './utils';
import { deliverTickerData, tickerJobs } from './connection';
import { tickerJob } from './types';

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
    if (verifyTicker(ticker)) {
        // options for api call
        const options: any = { period1: startDate, period2: endDate, interval: '1d' };
        const results = await yahooFinance.historical(ticker, options);
        // return response to backend
        deliverTickerData(results);
    };


}

const crawlStocks = async () => {
    try {
        // get ticker names from backend
        const ticker = tickerJobs.pop();
        if (ticker) {
            await getStockData(ticker);
        }
    } catch (error) {
        console.log(error);
    }
}


setTimeout(crawlStocks, 60 * 60 * 1000); // every 60 minutes