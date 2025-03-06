import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const server = new ApolloServer({

})

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 3000
  }
})

console.log("server started at", 3000)