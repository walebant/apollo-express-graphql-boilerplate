import { sign } from 'jsonwebtoken';
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS,
} from '../config';

export const issueToken = async ({ id, name, username, email }) => {
  const token = await sign({ id, name, username, email }, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRATION_MINUTES,
  });
  const refreshToken = await sign(
    { id, name, username, email },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRATION_DAYS,
    }
  );
  // `Bearer ${token}`;
  return {
    token,
    refreshToken,
  };
};
