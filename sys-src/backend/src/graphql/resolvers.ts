import { ASTNode, GraphQLScalarType, Kind } from "graphql";
import { aggregate, groupby } from "../util/list";
import date from "../util/time";
import Context from "./context";

// Subset of the "info" parameter (this one containing only relevant information)
type Info = {
    name: string,
    description?: string,
};

// Type for raw sentiment data
type SentimentRaw = {
    time: Date,
    positive: number,
    negative: number,
    neutral: number
};

// Type for crawler data
type Comment = {
    subredditName: string,
    text: string,
    timestamp: Date,
    commentId: string,
    userId?: string,
    articleId?: string,
};

// GraphQL does not know about any "Date" type so we create one
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date (custom scalar type)',
    serialize: (value: any) => value.toISOString ? value.toISOString() : new Date(value).toISOString(),
    parseValue: (value: any) => new Date(value),
    parseLiteral: (ast: ASTNode) => {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});

// GraphQL resolvers
const resolvers = {
    // Date type uses our own resolver
    Date: dateScalar,

    Subreddit: {
        name: (parent: { name: string }, args: {}, context: Context, info: Info) => {
            return parent.name;
        },
        sentiment: (parent: { name: string }, args: { keywords: Array<string>, from?: Date, to?: Date }, context: Context, info: Info) => {
            const sentiments = context.db.getSentiments(parent.name);
            const to = args.to ?? date("9999-12-31Z");
            const from = args.from ?? date("0000-01-01Z");
            const grouped = groupby(sentiments.filter(d => d.time >= from && d.time <= to), s => s.time.valueOf());
            const agg = aggregate(grouped,
                s => {
                    return {
                        time: s.time,
                        positive: 0,
                        negative: 0,
                        neutral: 0
                    };
                },
                (prev, current) => {
                    return {
                        time: prev.time,
                        positive: prev.positive + (current.sentiment > 0.66 ? 1 : 0),
                        negative: prev.negative + (current.sentiment < 0.33 ? 1 : 0),
                        neutral: prev.neutral + (current.sentiment >= 0.33 && current.sentiment <= 0.66 ? 1 : 0),
                    };
                });
            return agg.values();
        }
    },

    Sentiment: {
        // time, positive, neutral & negative are fields and therefore handled by Apollo
        // sum is a composite field and is evaluated dynamically
        sum: (parent: SentimentRaw, args: {}, context: Context, info: Info) => parent.positive + parent.neutral + parent.negative,
    },

    // Query: special type
    Query: {
        subreddit: (parent: {}, args: { nameOrUrl: string }, context: Context, info: Info) => {
            const sr = context.db.getSubreddits().find(s => s == args.nameOrUrl);
            if (typeof (sr) !== 'undefined') {
                return { name: sr };
            }
            return null;
        },
        subreddits: (parent: {}, args: {}, context: Context, info: Info) => {
            return context.db.getSubreddits();
        }
    },

    // Mutation: special type
    Mutation: {
        addComment: (parent: {}, args: { comment: Comment }, context: Context, info: Info) => {
            context.db.addComment(args.comment.subredditName, args.comment.text, args.comment.timestamp, Math.random());
            return true;
        },
    }
};

export default resolvers;