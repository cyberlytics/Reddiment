import compression from 'compression';
import express from 'express';
import http from 'http';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typedefs';
import { createAndStartApolloServer } from './server.apollo';

async function startServer(): Promise<void> {
    // Port is defined in Dockerfile (with fallback to 4000)
    const port = process.env.BACKEND_PORT || 4000;

    // ExpressJS middleware
    const app = express();
    // Activate HTTP compression
    app.use(compression());
    // Create server
    const httpServer = http.createServer(app);
    // Create Apollo-Server endpoint
    const apolloServer = await createAndStartApolloServer(httpServer, app, typeDefs, resolvers);

    // Start server
    httpServer.listen({ port: port }, () => console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`));
}

startServer();