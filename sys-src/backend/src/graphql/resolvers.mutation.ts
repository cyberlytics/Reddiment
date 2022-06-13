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

/**
 * Resolves top-level mutations.
 */
const MutationResolver = {
    addComment: async (parent: {}, args: { comment: Comment }, context: Context, info: Info): Promise<boolean> => {
        const sentiment = await context.sentiment(args.comment.text);
        if (typeof sentiment !== 'undefined') {
            context.db.addComment(args.comment.subredditName, args.comment.text, args.comment.timestamp, sentiment);
            return true;
        }
        return false;
    },
};

export { Comment, MutationResolver };