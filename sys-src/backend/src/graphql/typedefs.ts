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

    type Stock {
        name: String!
        values(from: Date, to: Date): [StockData!]!
    }

    type StockData {
        time: Date!
        close: Float!
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

    input RawStock {
        stockName: String!
        date: Date!
        open: Float
        close: Float!
        adjClose: Float
        volume: Float
        high: Float
        low: Float
    }

    type Query {
        subreddit(nameOrUrl: String!): Subreddit
        subreddits: [String!]!

        stock(name: String!): Stock
        stocks: [String!]!

        health: [ServiceHealth!]!
        jobs: [String!]!
    }

    type Mutation {
        addComment(comment: Comment!): Boolean!
        addStock(stock: RawStock!): Boolean!
    }
`;

export default typeDefs;