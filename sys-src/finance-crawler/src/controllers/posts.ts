import express from 'express';
import yahooFinance from 'yahoo-finance2';
import { formatDate } from '../utils';
import { verifyTicker } from '../utils';


// adding a post
const addPost = async (req: express.Request, res: express.Response) => {
    // get daily values between startDate and endDate of given ticker
    if (!req.body.ticker) {
        return false
    };
    const ticker: string = req.body.ticker;

    // if req has field startDate or endDate set those values to the startDate and endDate variables

    let startDate: string = req.body.startDate;
    const endDate: string = formatDate(new Date());

    if (!ticker || ticker == '') {
        // return error if ticker is not set
        res.status(400).json({
            message: "ticker is required"
        });
    }
    // check if req has startDate and endDate
    if (!startDate) {
        // set startDate to the current date minus one year
        startDate = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    };

    if (verifyTicker(ticker)) {
        const currentDate = new Date();
        // options for api call
        const options: any = { period1: startDate, period2: endDate, interval: '1d' };
        const results = await yahooFinance.historical(ticker, options);
        // return response
        return res.status(200).json({
            message: results
        });
    }
    else {
        return res.status(400).json({
            message: 'Invalid ticker'
        });
    }
};

export default { addPost };