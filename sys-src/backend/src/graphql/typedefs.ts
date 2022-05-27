import { gql } from "apollo-server-core";

const typeDefs = gql`
    scalar Date

    type Subreddit {
        name: String!
        sentiment(keywords: [String!]!, from: Date, to: Date): [Sentiment!]!
    }

    type Sentiment {
        time: Date!
        positive: Int!
        negative: Int!
        neutral: Int!
        sum: Int!
    }

    type Query {
        subreddit(nameOrUrl: String!): Subreddit
        subreddits: [String!]!
    }
`;

export default typeDefs;