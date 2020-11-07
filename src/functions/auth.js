import { sign, verify } from 'jsonwebtoken';
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
  const access = await sign({ id, name, username, email }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION_MINUTES,
  });
  const refresh = await sign(
    { id, name, username, email },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRATION_DAYS,
    }
  );
  // `Bearer ${token}`;
  return {
    access,
    refresh,
  };
};

export const hashPassword = async password =>
  hash(password, 10 /* Salt level */);

export const comparePassword = async (providedPassword, serverPassword) =>
  compare(providedPassword, serverPassword);

export const getUser = async req => {
  const token = req.headers.authorization || '';

  const decodedToken = verify(token, JWT_ACCESS_SECRET);

  if (!decodedToken)
    throw new AuthenticationError('User authentication failed. Please login.');

  // try to retrieve a user with the token
  const authUser = await User.findById(decodedToken.id);

  if (!authUser) throw new NOT_FOUND_ERROR('User not found!');
  return authUser;
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
