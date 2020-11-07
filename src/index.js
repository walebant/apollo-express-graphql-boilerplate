import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { error, success } from 'consola';
import { ApolloServer } from 'apollo-server-express';
import { PORT, DB_URI, IN_PROD } from './config';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';

// Initialize the app
const app = express();

// Setup middlewares
app.use(cors());

// Setup apollo-express-server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: IN_PROD
    ? false
    : {
        settings: {
          'request.credentials': 'include',
        },
      },
  introspection: true,
});

// Startup ApolloServer
const connect = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    success({
      badge: true,
      message: `Successfully connect to MONGO_DB \n${DB_URI}`,
    });

    server.applyMiddleware({ app, cors: false });
    app.listen(PORT, () =>
      success({
        badge: true,
        message: `Successfully connect to MONGO_DB \n${DB_URI}`,
      })
    );

    success({
      badge: true,
      message: `Apollo server started on \nhttp://localhost:/${PORT}${server.graphqlPath}`,
    });
  } catch (err) {
    error({
      badge: true,
      message: `Unable to start the server \n${err.message}`,
    });
  }
};

connect();
