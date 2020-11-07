import * as yup from 'yup';

const name = yup
  .string()
  .required('Name is required.')
  .min(4, 'Username should have at least 4 characters.')
  .max(30, 'Username should have at most 30 characters.')
  .matches(/^\w+$/, 'Should be alphanumeric.');

const username = yup
  .string()
  .required('Username is required.')
  .min(3, 'Username should have at least 3 characters.')
  .max(10, 'Username should have at most 10 characters.')
  .matches(/^\w+$/, 'Should be alphanumeric.');

const email = yup
  .string()
  .required('Email is required.')
  .email('This is invalid email.');

const password = yup
  .string()
  .required('Password is required.')
  .min(6, 'Password should have at least 6 characters.')
  .max(10, 'Password should have at most 10 characters.');

const role = yup.mixed().oneOf(['user', 'admin']);

export const UserRegisterationRules = yup.object().shape({
  name,
  username,
  password,
  email,
  role,
});

export const UserAuthenticationRules = yup.object().shape({
  username,
  password,
});
