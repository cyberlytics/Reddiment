import { ApolloServerPluginDrainHttpServer, ContextFunction, PluginDefinition } from "apollo-server-core";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import express from 'express';
import { DocumentNode } from "graphql";
import http from 'http';
import Context, { ServiceHealthInformation } from "./graphql/context";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typedefs";
import { ElasticDb } from "./services/database";
import DbMock from "./services/database.mock";
import { getSentiment } from "./services/sentiment";
import { getSentimentMock } from "./services/sentiment.mock";
import { HealthCallback } from "./services/serviceinterface";


const healthInfo = new Map<string, ServiceHealthInformation>();

let dbMock: DbMock | undefined = undefined;
function getDbMock(hc: HealthCallback) {
    if (typeof dbMock === 'undefined') {
        dbMock = new DbMock(hc);
        dbMock.initDummy();
    }
    return dbMock;
}


function contextFunctionForMock({ req }: ExpressContext): Context {
    return {
        db: getDbMock(s => healthInfo.set('database', { status: s, lastConnect: s == 'UP' ? new Date() : undefined })),
        sentiment: getSentimentMock,
        health: healthInfo,
    };
};

function contextFunctionForProduction({ req }: ExpressContext): Context {
    return {
        sentiment: getSentiment,
        db: new ElasticDb(s => healthInfo.set('database', { status: s, lastConnect: s == 'UP' ? new Date() : undefined })),
        health: healthInfo,
    };
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
    const server = createApolloServer(plugins, process.env.PRODUCTION == "true" ? contextFunctionForProduction : contextFunctionForMock);

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

