import express from 'express';
import yahooFinance from 'yahoo-finance2';
import { HistoricalOptions } from 'yahoo-finance2/dist/esm/src/modules/historical';
import { formatDate } from '../utils';
import { verifyTicker } from '../utils';


// adding a post
const addPost = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // get the data from req.body
    // let title: string = req.body.title;

    // add the post
    console.log("parsing..")

    const ticker: string = req.body.ticker;
    console.log("ticker is %d", ticker)

    if (verifyTicker(ticker)) {
        const currentDate = new Date();
        console.log("currentDate is %d", currentDate);
        const options: HistoricalOptions = { period1: '2010-01-01', period2: formatDate(currentDate), interval: '1d' };
        const results = await yahooFinance.historical(ticker, options);
        console.log("results is %d", results);
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