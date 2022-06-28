
import { tickerJob, tickerResult } from "./types";
import { formatDate } from "./utils";


// backendurl to get the tickers and send the reuslts to.
const BackendURL = `http://${process.env.BACKEND_ADDR}/graphql`;

const dailyTickers = [
    { name: 'AAPL', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'MSFT', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'AMZN', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'GOOG', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'FB', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'TWTR', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'TSLA', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'NFLX', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'BABA', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'NVDA', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'AMD', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'INTC', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'CSCO', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'CMCSA', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'TXN', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'PYPL', startDate: formatDate(new Date()), endDate: formatDate(new Date()) },
    { name: 'QCOM', startDate: formatDate(new Date()), endDate: formatDate(new Date()) }
];

// define a variable to store the current tickers as a list of tickerJob
export let tickerJobs: tickerJob[] = [];


// fill in format of tickerResult and send it to backend
export async function deliverTickerData(results: tickerResult[]) {
    try {
        for (const i in results) {
            const resp = await fetch(BackendURL, {
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
        };

    } catch (error) {
        console.log(error);
    };
}

// funciton to add a ticker to the list of tickers
export async function addTicker() {
    try {

        // add tickers to the list of tickers from backend
        // fetch backendurl and get tickerjobs
        // const resp = await fetch(BackendURL, {
        //     method: 'POST',
        //     body: JSON.stringify({
        //         query: "query GetTickers {getTickers}",
        //         operationName: 'getTickers'
        //     }),
        //     headers: {
        //         'Content-Type': 'application/json',
        //     }
        // });
        // const data = await resp.json();
        // tickerJobs = data.data.getTickers;

        // ...
        if (tickerJobs.length === 0) {
            tickerJobs = dailyTickers;
        }


        // additional tickers that should be monitored anyway


        for (const i in tickerJobs) {
            const currentTicker: tickerJob = {
                name: tickerJobs[i].name,
                startDate: tickerJobs[i].startDate,
                endDate: tickerJobs[i].endDate
            }
            tickerJobs.push(currentTicker);
            console.log(`Ticker ${currentTicker.name} added to list of tickers`);
        }
    }
    catch (error: any) {
        console.log('error', error);
    }
}


//setTimeout(addTicker, 24 * 60 * 60 * 1000); // every day
