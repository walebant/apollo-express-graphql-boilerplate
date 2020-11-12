import nodemailer from 'nodemailer';
import { error, success } from 'consola';
import { email, IN_PROD } from '../config';

export const transport = nodemailer.createTransport(email.smtp);
/* istanbul ignore next */
if (!IN_PROD) {
  transport
    .verify()
    .then(() => success('Connected to email server'))
    .catch(() =>
      error(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      )
    );
}

export const sendEmail = async (to, subject, text) => {
  const msg = { from: email.from, to, subject, text };
  await transport.sendMail(msg);
};

export const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

export const sendVerificationEmail = async (to, token) => {
  const subject = 'Verify Your Account';
  const link = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
  To verify your account, please click on this link: ${link}
  If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};
