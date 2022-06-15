import * as React from "react";
import * as ReactDOM from "react-dom";

const getStock = async (ticker: string, time: string = 'yearly') => {
    console.log("Getting data");
    const request = await fetch(`http://localhost:8080/stock`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            ticker: ticker,
            type: time
        })
    });
    
    const data = await request.json();
    console.log(data);
    return data;
};

const getMultipleStocks = async (tickersArray: string[], timesArray: string[]) => {
    const request = await fetch(`http://localhost:8080/stocks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            tickers: tickersArray,
            type: timesArray
        })
    });

    const data = await request.json();
    console.log(data);
    return data;
}

const getUnlimitedStocks = async (tickersArray: string[], timesArray: string[]) => {
    const request = await fetch(`http://localhost:8080/stocks-unlimited`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            tickers: tickersArray,
            type: timesArray
        })
    });

    const data = await request.json();
    console.log(data);
    return data;
}



// create a class that renders getMultipleStocks to the DOM
class App extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello, Welcome to React and TypeScript</h1>
                < button onClick={() => getStock("AAPL", 'weekly')}>Get single Stocks</button>
                < button onClick={() => getMultipleStocks(["AAPL", "MSFT"], ['daily', 'weekly'])}>Get Multiple Stocks</button>
                < button onClick={() => getMultipleStocks(["AAPL", "MSFT"], ['monthly', 'yearly'])}>Get unlimited Stocks</button>
            </div>
        );
    }
}


export default App;

// call getStock and log results to console
getStock("AAPL", 'weekly')