import { daynumber, MillisecondsPerDay } from "../util/time";
import Context from "./context";
import Info from "./info";

// Type for crawler data
type Comment = {
    subredditName: string,
    text: string,
    timestamp: Date,
    commentId: string,
    userId?: string,
    articleId?: string,
    upvotes?: number,
    downvotes?: number,
};

type RawStock = {
    stockName: string,
    date: Date,
    close: number,
    open?: number,
    adjClose?: number,
    volume?: number,
    high?: number,
    low?: number,
};

/**
 * Resolves top-level mutations.
 */
const MutationResolver = {
    addComment: async (parent: {}, args: { comment: Comment }, context: Context, info: Info): Promise<boolean> => {
        const sentiment = await context.sentiment(args.comment.text);
        if (typeof sentiment !== 'undefined') {
            return await context.db.addComment({
                sentiment: sentiment,
                subreddit: args.comment.subredditName,
                text: args.comment.text,
                timestamp: args.comment.timestamp,
                upvotes: args.comment.upvotes ?? 0,
                downvotes: args.comment.downvotes ?? 0,
                articleId: args.comment.articleId ?? '',
                userId: args.comment.userId ?? '',
                commentId: args.comment.commentId,
            });
        }
        return false;
    },

    addStock: async (parent: {}, args: { stock: RawStock }, context: Context, info: Info): Promise<boolean> => {
        return await context.db.addFinance({
            timestamp: new Date(daynumber(args.stock.date) * MillisecondsPerDay),
            adjClose: args.stock.adjClose ?? 0,
            stock: args.stock.stockName,
            close: args.stock.close,
            high: args.stock.high ?? 0,
            low: args.stock.low ?? 0,
            open: args.stock.open ?? 0,
            volume: args.stock.volume ?? 0,
        });
    }
};

export { Comment, RawStock, MutationResolver };