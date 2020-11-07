import { sign, verify } from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import { hash, compare } from 'bcryptjs';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { NOT_FOUND_ERROR, UNAUTHORIZED_ERROR } from '../utils/errors';
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS,
} from '../config';
import { User } from '../models';

export const issueToken = async ({ id, name, username, email }) => {
  const accessToken = await sign(
    { id, name, username, email },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRATION_MINUTES,
    }
  );
  const refreshToken = await sign(
    { id, name, username, email },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRATION_DAYS,
    }
  );

  // `Bearer ${token}`;
  return {
    access: {
      token: accessToken,
      expires: jwtDecode(accessToken).exp,
    },
    refresh: {
      token: refreshToken,
      expires: jwtDecode(refreshToken).exp,
    },
  };
};

export const hashPassword = async password =>
  hash(password, 10 /* Salt level */);

export const comparePassword = async (providedPassword, serverPassword) =>
  compare(providedPassword, serverPassword);

export const getUser = async (req, requiresAuth = true) => {
  const header = req.headers.authorization || '';

  if (header) {
    const token = verify(header, JWT_ACCESS_SECRET);
    // try to retrieve a user with the token
    const authUser = await User.findById(token.id);

    if (!authUser)
      throw new AuthenticationError(
        'Invalid token. User authentication failed.'
      );

    if (requiresAuth) {
      return authUser;
    }

    return null;
  }
};

export const getRefreshToken = async req => {
  const token = req.headers.refresh_token || '';

  const decodedToken = verify(token, JWT_REFRESH_SECRET);

  if (!decodedToken)
    throw new AuthenticationError('User authentication failed. Please login.');

  // try to retrieve a user with the token
  const authUser = await User.findById(decodedToken.id);

  if (!authUser) throw new NOT_FOUND_ERROR('User not found!');
  return authUser;
};
