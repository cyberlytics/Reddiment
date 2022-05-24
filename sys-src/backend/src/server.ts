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
    // Port is defined in Dockerfile (with fallback to 4000)
    const port = process.env.PORT || 4000;

    // ExpressJS middleware
    const app = express();
    // Activate HTTP compression
    app.use(compression());
    // Create server
    const httpServer = http.createServer(app);
    // Create Apollo-Server endpoint
    const apolloServer = await createApolloServer(httpServer, app, typeDefs, resolvers);

    // Start server
    httpServer.listen({ port: port }, () => console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`));
}

startServer();