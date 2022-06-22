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
        const grouped = groupby(sentiments, s => daynumber(s.time));
        const agg = aggregate(grouped,
            (s, k) => {
                return {
                    time: new Date(k * MillisecondsPerDay),
                    positive: 0,
                    negative: 0,
                    neutral: 0
                };
            },
            (prev, current) => {
                return {
                    time: prev.time,
                    positive: prev.positive + (current.sentiment > 0.01 ? 1 : 0),
                    negative: prev.negative + (current.sentiment < -0.01 ? 1 : 0),
                    neutral: prev.neutral + (current.sentiment >= -0.01 && current.sentiment <= 0.01 ? 1 : 0),
                };
            });
        return agg.values();
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