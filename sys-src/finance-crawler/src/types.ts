


// ticker type to store one day of market data
type tickerJob = {
    name: string; // name of ticker symbol 'AAPL'
    startDate: string; // date where crawler should start: YYYY-MM-DD
    endDate: string; // date where crawler should end: YYYY-MM-DD
}

// results will be returned with following format
type tickerResult = {
    name: string; // name of ticker symbol 'AAPL'
    date: string; // day of market data YYYY-MM-DD
    open: number; // open value of stock at given day
    high: number; // high value of stock (highest price)
    low: number; // low value of stock (lowest price of the day)
    close: number; // close value of stock (last trade)  
    volume: number; // volume of stock (number of shares)
}
export { tickerJob, tickerResult };