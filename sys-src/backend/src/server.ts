import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import compression from 'compression';
import http from 'http';
import typeDefs from './graphql/typedefs';
import { DocumentNode } from 'graphql';
import resolvers from './graphql/resolvers';


async function createApolloServer(httpServer: http.Server, app: express.Express, typeDefs: DocumentNode, resolvers: any): Promise<ApolloServer> {
    // ApolloServer initialization plus the drain plugin.
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

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

async function startServer(): Promise<void> {
    const port = process.env.PORT || 4000;

    const app = express();
    app.use(compression());
    const httpServer = http.createServer(app);

    const apolloServer = await createApolloServer(httpServer, app, typeDefs, resolvers);

    httpServer.listen({ port: port }, () => console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`));
}

startServer();