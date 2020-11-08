import { sign } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
// import { ApolloError, AuthenticationError } from 'apollo-server-express';
// import { NOT_FOUND_ERROR, UNAUTHORIZED_ERROR } from '../utils/errors';
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS,
} from '../config';

export const issueToken = ({ id, role }) => {
  const accessToken = sign({ id, role }, JWT_ACCESS_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION_MINUTES,
  });

  const refreshToken = sign({ id, role }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION_DAYS,
  });

  return {
    access: accessToken,
    refresh: refreshToken,
  };
};

export const hashPassword = async password =>
  hash(password, 10 /* Salt level */);

export const comparePassword = async (providedPassword, serverPassword) =>
  compare(providedPassword, serverPassword);
