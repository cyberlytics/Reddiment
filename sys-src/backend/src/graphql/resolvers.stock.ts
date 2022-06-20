import { date } from "../util/time";
import Context from "./context";
import Info from "./info";

/**
 * Resolves queries regarding stock data.
 */
const StockResolver = {
    name: (parent: { name: string }, args: {}, context: Context, info: Info) => {
        return parent.name;
    },

    values: async (parent: { name: string }, args: { from?: Date, to?: Date }, context: Context, info: Info) => {
        const to = args.to ?? date("9999-12-31Z");
        const from = args.from ?? date("0000-01-01Z");
        const stockData = await context.db.getFinance(parent.name, from, to);
        const values = stockData.map(s => {
            return {
                time: s.time,
                close: s.close,
            };
        });
        return values;
    }
};

/**
 * Resolves top-level queries that belong to the Stock Data topic.
 */
const StockQueryResolver = {
    stock: async (parent: {}, args: { name: string }, context: Context, info: Info) => {
        const stocks = await context.db.getStocks();
        const stock = stocks.find(s => s == args.name);
        if (typeof (stock) !== 'undefined') {
            return { name: stock };
        }
        return null;
    },
    stocks: async (parent: {}, args: {}, context: Context, info: Info) => {
        return await context.db.getStocks();
    },
};

export { StockQueryResolver, StockResolver };
