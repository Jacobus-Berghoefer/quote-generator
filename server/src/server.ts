import express, { Request } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'path';
import { fileURLToPath } from 'url';
//import routes from "./routes/index.js";
import { typeDefs, resolvers } from './schemas/index.js';
import { connectDB } from './config/connection.js';
import { authenticateToken } from './services/auth.js';


// ✅ Define __dirname manually for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the port the server will run on
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [],
});

const startApolloServer = async () => {
  await server.start();
  console.log("✅ Apollo Server Started!");

  // Load body-parsing middleware BEFORE GraphQL middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Ensures req.body is set

  // Attach ApolloServer to Express
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        console.log("✅ GraphQL Context Function Called!");

        // Authenticate user using auth service
        const user = authenticateToken({ req });

        // Log authentication status
        if (user) {
          console.log("✅ User Authenticated:", user);
        } else {
          console.log("❌ No valid token found.");
        }

        return { ...user }; // Attach user to context for resolvers
      },
    })
  );  
  
  //app.use("/api", routes);

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  
  //[Replaced with below] db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  connectDB();

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
