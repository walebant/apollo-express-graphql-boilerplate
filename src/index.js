import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { error, success } from 'consola';
import { ApolloServer } from 'apollo-server-express';
import { verify, decode } from 'jsonwebtoken';
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

    // verify accessToken is valid and attach userId and role
    // to req object
    try {
      data = verify(accessToken, JWT_ACCESS_SECRET);
      req.userId = data.id;
      req.userRole = data.role;
    } catch (error) {}

    // if accessToken is is Expired
    /*
      token refresh mechanism
      verify refreshToken is valid
      if not return req object
    */

    try {
      data = verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      return { req };
    }

    // if refreshToken is valid
    // fetch user from database
    const user = await User.findById(data.id);

    // confirm refresh token from server is not expired
    const tokenExpiration = decode(user.tokens.refresh).exp;
    const currentTime = Date.now().valueOf() / 1000;
    const isExpired = tokenExpiration > currentTime;

    // if no user or refresh token is expired
    if (!user || !isExpired) return { req };

    // proceed to Generate new tokens
    // if server refresh token is still validate
    // otherwise user has to re-login
    console.log('expired tokens, generating new ones');
    const tokens = issueToken(user);
    user.tokens = tokens;
    await user.save();
    req.userId = data.id;
    req.userRole = data.role;

    return { req };
  },
  playground: IN_PROD
    ? false
    : {
        settings: {
          'request.credentials': 'include',
        },
      },
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
