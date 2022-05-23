import { gql } from "apollo-server-core";

const typeDefs = gql`
    scalar Date

    type Subreddit {
        name: String!
        hype(keywords: [String!]!, from: Date, to: Date): Hype
    }

    type Hype {
        dummy: String
    }

    type Query {
        subreddit(nameOrUrl: String!): Subreddit
        subreddits: [String!]!
    }
`;

export default typeDefs;