import { User } from '../models';
import { issueToken, hashPassword, comparePassword } from '../functions/auth';
import { UserRegisterationRules, UserAuthenticationRules } from '../validators';
import {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  SERVER_ERROR,
} from '../utils/errors';
import { sendVerificationEmail, sendEmail } from '../services';

export const authController = {
  profile: async (_, _args, { req }) => {
    if (!req.userId)
      throw new UNAUTHORIZED_ERROR('Not authenticated. Please login.');
    const user = await User.findById(req.userId);

    return user;
  },
  users: async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new SERVER_ERROR(error.message);
    }
  },

  logout: async (_, _args, { req }) => {
    // invalidate token on server
    if (!req.userId)
      throw new UNAUTHORIZED_ERROR('Not authenticated. Please login.');
    const user = await User.findById(req.userId);
    try {
      // Blacklist Authentication Token
      user.tokens.access = '';
      user.tokens.refresh = '';
      await user.save();

      return 'Log out success';
    } catch (error) {
      throw new SERVER_ERROR(error.message);
    }
  },
  register: async (_, args) => {
    // Validate user data
    await UserRegisterationRules.validate(args, {
      abortEarly: true,
    });

    const { username, email, password } = args;

    try {
      let user;
      // Check if user is already registered
      // user = await User.findOne({ username });
      // if (user) throw new BAD_REQUEST_ERROR('Username is already taken.');
      user = await User.findOne({ email });
      if (user) throw new BAD_REQUEST_ERROR('Email is already taken.');

      user = new User(args);
      // hash the password
      user.password = await hashPassword(password);

      // Issues Authentication Token
      const tokens = issueToken(user);

      user.tokens = tokens;
      const result = await user.save();

      // send verification email
      await sendVerificationEmail(user.email, issueToken(user, 'email'));

      return {
        user: result,
        tokens,
      };
    } catch (error) {
      throw new SERVER_ERROR(error.message);
    }
  },
  login: async (_, args) => {
    // Validate user data
    await UserAuthenticationRules.validate(args, {
      abortEarly: true,
    });
    try {
      // Check if user is registered
      const user = await User.findOne({ username: args.username });
      if (!user) throw new NOT_FOUND_ERROR('User not found.');

      // Compare password
      const isMatch = await comparePassword(args.password, user.password);
      if (!isMatch) throw new BAD_REQUEST_ERROR('Invalid password.');

      // Issues Authentication Token
      const tokens = issueToken(user);

      user.tokens = tokens;
      await user.save();

      return {
        user,
        tokens,
      };
    } catch (error) {
      throw new SERVER_ERROR(error.message);
    }
  },
  invalidateTokens: async (_, _args, { req }) => {
    if (!req.userId)
      throw new UNAUTHORIZED_ERROR('Not authenticated. Please login.');
    try {
      const user = await User.findById(req.userId);

      return user;
    } catch (error) {
      // throw new ApolloError()
    }
  },
  resetPasswordUrl: async (_, _args, { req }) => {},
};
