import { aggregate, groupby } from "../util/list";
import { date, daynumber, MillisecondsPerDay } from "../util/time";
import Context from "./context";
import Info from "./info";

// Type for raw sentiment data
type SentimentRaw = {
    time: Date,
    positive: number,
    negative: number,
    neutral: number
};

/**
 * Resolves queries regarding subreddits.
 */
const SubredditResolver = {
    name: (parent: { name: string }, args: {}, context: Context, info: Info) => {
        return parent.name;
    },

    sentiment: async (parent: { name: string }, args: { keywords: Array<string>, from?: Date, to?: Date }, context: Context, info: Info) => {
        const to = args.to ?? date("9999-12-31Z");
        const from = args.from ?? date("0000-01-01Z");
        const sentiments = await context.db.getSentiments(parent.name, from, to, args.keywords);
        return sentiments;
    }
};

/**
 * Resolves top-level queries that belong to the Subreddit topic.
 */
const SubredditQueryResolver = {
    subreddit: async (parent: {}, args: { nameOrUrl: string }, context: Context, info: Info) => {
        const srs = await context.db.getSubreddits();
        const sr = srs.find(s => s == args.nameOrUrl);
        if (typeof (sr) !== 'undefined') {
            return { name: sr };
        }
        return null;
    },
    subreddits: async (parent: {}, args: {}, context: Context, info: Info) => {
        return await context.db.getSubreddits();
    }
};

export { SentimentRaw, SubredditQueryResolver, SubredditResolver };