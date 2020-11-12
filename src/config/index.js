import { config } from 'dotenv';

const { parsed } = config();

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRATION_MINUTES,
  JWT_REFRESH_EXPIRATION_DAYS,
  IN_PROD = NODE_ENV === 'production',
} = parsed;

export const email = {
  smtp: {
    host: parsed.SMTP_HOST,
    port: parsed.SMTP_PORT,
    secure: false,
    auth: { user: parsed.SMTP_USERNAME, pass: parsed.SMTP_PASSWORD },
  },
  from: parsed.EMAIL_FROM,
};
