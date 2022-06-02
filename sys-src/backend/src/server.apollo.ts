import { ApolloServerPluginDrainHttpServer, ContextFunction, PluginDefinition } from "apollo-server-core";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import express from 'express';
import { DocumentNode } from "graphql";
import http from 'http';
import Context from "./graphql/context";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typedefs";
import DbMock from "./services/database.mock";
import { getSentimentMock } from "./services/sentiment.mock";


let dbMock: DbMock | undefined = undefined;
function getDbMock() {
    if (typeof dbMock === 'undefined') {
        dbMock = new DbMock();
        dbMock.initDummy();
    }
    return dbMock;
}


function contextFunctionForMock({ req }: ExpressContext): Context {
    return {
        db: getDbMock(),
        sentiment: getSentimentMock,
    };
};

function contextFunctionForProduction({ req }: ExpressContext): Context {
    throw 'Not implemented (yet)!';

    // return {
        // sentiment: getSentiment
    // }
}




function createApolloServer(plugins: PluginDefinition[], contextFunc: ContextFunction<ExpressContext, object>): ApolloServer {
    // ApolloServer initialization.
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        plugins: plugins,
        context: contextFunc,
    });
    return server;
}

async function createAndStartApolloServer(httpServer: http.Server, app: express.Express, typeDefs: DocumentNode, resolvers: any): Promise<ApolloServer> {
    // Create Drain plugin outside Apollo Server creation
    const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];
    const server = createApolloServer(plugins, contextFunctionForMock);

    // More required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
        app,
        // By default, apollo-server hosts its GraphQL endpoint at the
        // server root. However, *other* Apollo Server packages host it at
        // /graphql. Optionally provide this to match apollo-server.
        path: '/graphql'
    });

    return server;
}


export { createApolloServer, createAndStartApolloServer, contextFunctionForMock };
