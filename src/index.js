import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { error, success } from 'consola';
import { ApolloServer } from 'apollo-server-express';
import { verify } from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import {
  PORT,
  DB_URI,
  IN_PROD,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} from './config';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import { User } from './models';

import { issueToken } from './functions/auth';

// Initialize the app
const app = express();

// Setup middlewares
app.use(cors());

// Setup apollo-express-server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // grab tokens from headers
    const accessToken = req.headers.authorization || '';
    const refreshToken = req.headers.refresh_token || '';

    let data;

    // verify accessToken is valid and attach userId and role to req object
    try {
      data = verify(accessToken, JWT_ACCESS_SECRET);
      req.userId = data.id;
      req.userRole = data.role;
    } catch (error) {}

    // refresh mechanism
    // verify refreshToken is valid
    try {
      data = verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {}
    console.log(accessToken);
    console.log(refreshToken);
    console.log(data);
    // if refreshToken is valid
    // fetch user from database
    const user = await User.findById(data.id);

    // confirm refresh token from server is not expired
    const tokenExpiration = jwtDecode(user.tokens.refresh).exp;
    const currentTime = Date.now().valueOf() / 1000;

    if (tokenExpiration < currentTime) {
      console.log('expired refresh');
    } else {
      console.log(user.id);
      const tokens = issueToken(user);
      user.tokens = tokens;
      await user.save();
      req.userId = data.id;
      req.userRole = data.role;
    }

    return { req };
  },
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

    server.applyMiddleware({ app });
    app.listen(PORT, () =>
      success({
        badge: true,
        message: `Apollo server started on \nhttp://localhost:/${PORT}${server.graphqlPath}`,
      })
    );
  } catch (err) {
    error({
      badge: true,
      message: `Unable to start the server \n${err.message}`,
    });
  }
};

connect();
