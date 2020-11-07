import { User } from '../../models';
import {
  issueToken,
  hashPassword,
  comparePassword,
  getUser,
  getRefreshToken,
} from '../../functions/auth';
import {
  UserRegisterationRules,
  UserAuthenticationRules,
} from '../../validators';
import {
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  UNAUTHORIZED_ERROR,
  SERVER_ERROR,
} from '../../utils/errors';

export default {
  Query: {
    profile: async (_, _args, { req }) => {
      const authUser = await getUser(req);
      return authUser;
    },
    users: async () => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        throw new SERVER_ERROR(error.message);
      }
    },
    refreshTokens: async (_, _args, { req }) => {
      try {
        const authUser = await getRefreshToken(req);
        console.log(authUser);
        // Issues Authentication Token
        const tokens = await issueToken(authUser);
        return {
          user: authUser,
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
        const tokens = await issueToken(user);

        return {
          user,
          tokens,
        };
      } catch (error) {
        throw new SERVER_ERROR(error.message);
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      // Validate user data
      await UserRegisterationRules.validate(args, {
        abortEarly: true,
      });

      const { username, email, password } = args;

      try {
        let user;
        // Check if user is already registered
        user = await User.findOne({ username });
        if (user) throw new BAD_REQUEST_ERROR('Username is already taken.');
        user = await User.findOne({ email });
        if (user) throw new BAD_REQUEST_ERROR('Email is already taken.');

        user = new User(args);
        // hash the password
        user.password = await hashPassword(password);

        const result = await user.save();

        // Issues Authentication Token
        const tokens = await issueToken(user);

        return {
          user: result,
          tokens,
        };
      } catch (error) {
        throw new SERVER_ERROR(error.message);
      }
    },
  },
};
