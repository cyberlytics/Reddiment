import Context from "./context";
import Info from "./info";
import { SentimentRaw } from "./resolvers.subreddit";

/**
 * Resolves sentiment data.
 */
const SentimentResolver = {
    // time, positive, neutral & negative are fields and therefore handled by Apollo
    // sum is a composite field and is evaluated dynamically
    sum: (parent: SentimentRaw, args: {}, context: Context, info: Info) => parent.positive + parent.neutral + parent.negative,
};

export { SentimentResolver };