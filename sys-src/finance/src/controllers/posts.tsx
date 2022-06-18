import { Request, Response, NextFunction } from 'express';

const DAILY_ADJUSTED = 'TIME_SERIES_DAILY_ADJUSTED';
const MONTHLY_ADJUSTED = 'TIME_SERIES_MONTHLY_ADJUSTED';
const YEARLY_ADJUSTED = 'TIME_SERIES_YEARLY_ADJUSTED';


// adding a post
const addPost = async (req: Request, res: Response, next: NextFunction) => {
    // get the data from req.body
    // let title: string = req.body.title;
    const body: string = req.body.body;
    // add the post
    const config = JSON.parse(JSON.stringify(body));
    const { ticker, times } = config;
    const request = await fetch(
        `https://www.alphavantage.co/query?function=${timePeriod(
            times
        )}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );

    // return response
    return res.status(200).json({
        message: res.json()
    });
};


const timePeriod = (type: string): string => {
    switch (type) {
        case 'daily':
            return DAILY_ADJUSTED;
        case 'monthly':
            return MONTHLY_ADJUSTED
        default:
            return YEARLY_ADJUSTED;
    }
}

export default { addPost };