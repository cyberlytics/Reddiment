import { ASTNode, GraphQLScalarType, Kind } from "graphql";
import date from "../util/time";
import Context from "./context";

// Subset of the "info" parameter (this one containing only relevant information)
type Info = {
    name: string,
    description?: string,
}

// Type for raw sentiment data
type SentimentRaw = {
    time: Date,
    positive: number,
    negative: number,
    neutral: number
}

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
            const s = dummyData.subreddits.find(s => s.name == parent.name);
            if (typeof (s) !== 'undefined') {
                const to = args.to ?? date("9999-12-31Z");
                const from = args.from ?? date("0000-01-01Z");
                return dummySentimentData.filter(d => d.time >= from && d.time <= to);
            }
            return [];
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
            return dummyData.subreddits.find(s => s.name == args.nameOrUrl);
        },
        subreddits: () => dummyData.subreddits.map(s => s.name),
    },
};

const dummyData = {
    subreddits: [
        {
            name: "r/wallstreetbets",
        },
        {
            name: "r/place",
        },
    ]
};

const dummySentimentData: Array<SentimentRaw> = [
    { time: date("2022-05-27Z"), positive: 123, negative: 87, neutral: 512 },
    { time: date("2022-05-28Z"), positive: 67, negative: 186, neutral: 342 },
    { time: date("2022-05-29Z"), positive: 234, negative: 34, neutral: 128 },
    { time: date("2022-05-30Z"), positive: 179, negative: 77, neutral: 946 },
    { time: date("2022-05-31Z"), positive: 134, negative: 180, neutral: 264 },
];

export default resolvers;