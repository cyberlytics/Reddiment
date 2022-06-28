
import { tickerJob, tickerResult } from "./types";


// backendurl to get the tickers and send the reuslts to.
const BackendURL = `http://${process.env.BACKEND_ADDR}/graphql`;

const startDate = new Date(Date.parse("2022-06-01T00:00:00Z")).toISOString();
const endDate = new Date().toISOString();

const dailyTickers = [
    { name: 'AAPL', startDate: startDate, endDate: endDate },
    { name: 'MSFT', startDate: startDate, endDate: endDate },
    { name: 'AMZN', startDate: startDate, endDate: endDate },
    { name: 'GOOG', startDate: startDate, endDate: endDate },
    { name: 'FB', startDate: startDate, endDate: endDate },
    { name: 'TWTR', startDate: startDate, endDate: endDate },
    { name: 'TSLA', startDate: startDate, endDate: endDate },
    { name: 'NFLX', startDate: startDate, endDate: endDate },
    { name: 'BABA', startDate: startDate, endDate: endDate },
    { name: 'NVDA', startDate: startDate, endDate: endDate },
    { name: 'AMD', startDate: startDate, endDate: endDate },
    { name: 'INTC', startDate: startDate, endDate: endDate },
    { name: 'CSCO', startDate: startDate, endDate: endDate },
    { name: 'CMCSA', startDate: startDate, endDate: endDate },
    { name: 'TXN', startDate: startDate, endDate: endDate },
    { name: 'PYPL', startDate: startDate, endDate: endDate },
    { name: 'QCOM', startDate: startDate, endDate: endDate }
];

// define a variable to store the current tickers as a list of tickerJob
export let tickerJobs: tickerJob[] = [];


// fill in format of tickerResult and send it to backend
export async function deliverTickerData(results: tickerResult[]) {
    try {
        for (const i in results) {
            const response = await fetch(BackendURL, {
                method: 'POST',
                body: JSON.stringify({
                    query: "mutation AddStock($stock: RawStock!) { addStock(stock: $stock) }",
                    variables: {
                        stock: {
                            stockName: results[i].name,
                            date: results[i].date,
                            open: results[i].open,
                            high: results[i].high,
                            low: results[i].low,
                            close: results[i].close,
                            volume: results[i].volume,
                        }
                    },
                    operationName: 'AddStock'
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const result = await response.json();
            if (result?.data?.addStock === true) {
                // Do nothing as everything worked perfectly
            }
            else {
                console.log(result);
            }
        };

    } catch (error) {
        console.log(error);
    };
}

// funciton to add a ticker to the list of tickers
export async function addTicker() {
    try {
        if (tickerJobs.length === 0) {
            tickerJobs = dailyTickers;
        }


        // tickers that should be monitored
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


addTicker();    // Run now
setInterval(addTicker, 10 * 60 * 1000); // every 10 Minutes
