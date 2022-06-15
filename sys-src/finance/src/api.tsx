
import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import cors from "cors";

const DAILY_ADJUSTED = 'TIME_SERIES_DAILY_ADJUSTED';
const MONTHLY_ADJUSTED = 'TIME_SERIES_MONTHLY_ADJUSTED';




const app = express();


app.use(cors());
//app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//require("dotenv").config();

// Post a new stock to get the data
app.post("/stock", async (req: { body: any; }, res: { json: (arg0: { data: any; }) => void; }) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const { ticker, times } = body;
    console.log("stocks-api.js 14 | body", body.ticker);
    const request = await fetch(
        `https://www.alphavantage.co/query?function=${timePeriod(
            times
        )}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
    );
    const data = await request.json();
    res.json({ data: data });
});

// post new stocks to get the data from multiple stocks
app.post("/stocks", async (req: { body: any; }, res: { json: (arg0: { error?: any; data?: any[]; status?: string; }) => void; }) => { //less than 5 stocks per minute
    const body = JSON.parse(JSON.stringify(req.body));
    const { tickers, times } = body;
    console.log("stocks-api.js 14 | body", body.tickers);
    let stocks = await tickers.map(async (ticker: any) => {
        const request = await fetch(
            `https://www.alphavantage.co/query?function=${timePeriod(times)}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
        );
        const data = await request.json();
        return data;
    });

    Promise.all(stocks)
        .then(values => {
            console.log("stocks-api.js 40 | values", values);
            if (values[0].Note) {
                console.log("stocks-api.js 48 | error", values[0].Note);
                res.json({ error: values[0].Note });
            } else {
                res.json({ data: values, status: "done" });
            }
        })
        .catch(error => {
            console.log("stocks-api.js 47 | error", error);
            res.json({ error: error });
        });
});


app.post("/stocks-unlimited", async (req: { body: any; }, res: { json: (arg0: { tickers: unknown[][]; }) => void; }) => {//unlimited stocks in 12 seconds X number of tickers (i.e 10 tickers = 120 seconds to get data.)
    const body = JSON.parse(JSON.stringify(req.body));
    const { tickers, times } = body;
    console.log("stocks-api 74 | tickers length", tickers.length);
    let stocksArray: unknown[][] = [];
    console.log("stocks-api.js 14 | body", body.tickers);
    await tickers.forEach(async (ticker: string, index: number) => {
        setTimeout(async () => {
            const request = await fetch(
                `https://www.alphavantage.co/query?function=${timePeriod(times)}&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
            );
            const data = await request.json() as Array<number>;
            stocksArray.push(Object.values(data));
            console.log("stocks-api 84 | stocks array", stocksArray);
            if (stocksArray.length === tickers.length) {
                res.json({ tickers: stocksArray });
            }
        }, index * 12000); // set a timeout for each ticker of 12 s
    });
});

app.listen(process.env.PORT || 8080, () => {
    console.log("index.js 6 | server started...");
});



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
module.exports = timePeriod;