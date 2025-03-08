import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express, { json } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Context } from './types/types.js';
import { typeDefs } from './schema/schema.js';
import { resolvers } from './resolvers/resolvers.js';

const prisma = new PrismaClient();
const app = express();

const server = new ApolloServer<Context>({ 
  typeDefs,
  resolvers,
});

async function startServer() {
  await server.start();
  
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        prisma,
        token: req.headers.authorization,
      }),
    })
  );

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});