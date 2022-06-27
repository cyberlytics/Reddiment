
import { tickerJob, tickerResult } from "./types";


// backendurl to get the tickers and send the reuslts to.
const BackendURL = `http://${process.env.BACKEND_ADDR}/graphql`;


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
async function addTicker() {
    try {
        const result = await fetch(BackendURL, {
            method: 'post',
            body: JSON.stringify({
                query: "query GetJobs { jobs }",
                operationName: "GetJobs"
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const obj = await result.json();
        const tickersToGet = (obj?.data?.jobs ?? []);
        for (const i in tickersToGet) {
            // check if jobs already exists
            const foundItems = tickerJobs.filter(
                item => item.name === tickersToGet[i].slice(2)
            );
            if (foundItems.length !== 0) continue;

            const currentTicker: tickerJob = {
                name: tickersToGet[i].name,
                startDate: tickersToGet[i].startDate,
                endDate: tickersToGet[i].endDate
            }
            tickerJobs.push(currentTicker);
        }
    }
    catch (error: any) {
        console.log('error', error);
    }
}


setTimeout(addTicker, 60 * 60 * 1000); // every hour
