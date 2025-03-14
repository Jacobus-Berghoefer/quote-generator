// Description: This file is the entry point for the server. It initializes the ApolloServer and connects to the database. It also serves the client in production.
import express from 'express'; // express lets us serve our GraphQL API
import { ApolloServer } from '@apollo/server'; // ApolloServer is the class we use to set up our server
import { expressMiddleware } from '@apollo/server/express4'; // expressMiddleware is a helper function that allows us to use ApolloServer with Express
import path from 'path'; // path is a Node.js module that provides utilities for working with file and directory paths
import { typeDefs, resolvers } from './schemas/index.js'; // typeDefs and resolvers are imported from the schemas folder
import db from './config/connection.js'; // db is imported from the connection.js file in the config folder

// Define the port the server will run on
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Define a function to start the ApolloServer
const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
