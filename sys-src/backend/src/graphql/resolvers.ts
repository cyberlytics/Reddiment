import { ASTNode, GraphQLScalarType, Kind } from "graphql";
import { JobQueryResolver } from "./resolvers.job";
import { MutationResolver } from "./resolvers.mutation";
import { SentimentResolver } from "./resolvers.sentiment";
import { ServiceHealthQueryResolver } from "./resolvers.servicehealth";
import { StockQueryResolver, StockResolver } from "./resolvers.stock";
import { SubredditQueryResolver, SubredditResolver } from "./resolvers.subreddit";

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
        throw `Invalid date format`;
    },
});

// GraphQL resolvers
const resolvers = {
    // Date type uses our own resolver
    Date: dateScalar,

    Subreddit: SubredditResolver,

    Sentiment: SentimentResolver,


    Stock: StockResolver,


    // Query: special type
    Query: {
        ...SubredditQueryResolver,
        ...StockQueryResolver,
        ...ServiceHealthQueryResolver,
        ...JobQueryResolver,
    },

    // Mutation: special type
    Mutation: MutationResolver,
};

export default resolvers;