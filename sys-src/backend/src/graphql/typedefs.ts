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

    type ServiceHealth {
        name: String!
        lastConnect: Date
        status: ServiceStatus!
    }

    enum ServiceStatus {
        UP
        DOWN
    }


    input Comment {
        subredditName: String!
        text: String!
        timestamp: Date!
        commentId: String!
        userId: String
        articleId: String
        upvotes: Int
        downvotes: Int
    }

    type Query {
        subreddit(nameOrUrl: String!): Subreddit
        subreddits: [String!]!
        health: [ServiceHealth!]!
        jobs: [String!]!
    }

    type Mutation {
        addComment(comment: Comment!): Boolean!
    }
`;

export default typeDefs;