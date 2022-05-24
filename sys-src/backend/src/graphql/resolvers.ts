import { ASTNode, GraphQLScalarType, Kind } from "graphql";
import Context from "./context";

type Info = {
    name: string,
    description?: string,
}

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

const resolvers = {
    Date: dateScalar,

    Subreddit: {
        name: (parent: { name: string }, args: {}, context: Context, info: Info) => {
            return parent.name;
        },
        hype: (parent: { name: string }, args: { keywords: Array<string>, from?: Date, to?: Date }, context: Context, info: Info) => {
            const s = dummyData.subreddits.find(s => s.name == parent.name);
            if (typeof (s) !== 'undefined') {
                return {
                    id: s.name + 'HYPE' + args.keywords.join(', '),
                    from: args.from,
                    to: args.to,
                };
            }
            return null;
        }
    },

    Hype: {
        dummy: (parent: { id: string, from?: Date, to?: Date }, args: {}, context: Context, info: Info) => {
            return parent.id + parent.from?.valueOf() + parent.to?.valueOf();
        },
    },

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
}

export default resolvers;