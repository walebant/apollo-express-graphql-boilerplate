import { config } from 'dotenv';

const { parsed } = config();

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS,
  IN_PROD = NODE_ENV === 'production',
} = parsed;

// export const PORT =
