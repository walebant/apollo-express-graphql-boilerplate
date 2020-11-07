import { hash } from 'bcryptjs';
import { User } from '../../models';
import { issueToken } from '../../functions/auth';
import {
  UserRegisterationRules,
  UserAuthenticationRules,
} from '../../validators';
import { BAD_REQUEST_ERROR, SERVER_ERROR } from '../../utils/errors';

export default {
  Query: {
    profile: () => {},
    users: () => {},
    token: () => {},
    refreshToken: () => {},
    login: () => {},
  },
  Mutation: {
    register: async (_, newUser) => {
      // Validate user data
      await UserRegisterationRules.validate(newUser, {
        abortEarly: true,
      });

      const { username, email, password } = newUser;

      try {
        let user;
        // Check if user is already registered
        user = await User.findOne({ username });
        if (user) throw new BAD_REQUEST_ERROR('Username is already taken.');
        user = await User.findOne({ email });
        if (user) throw new BAD_REQUEST_ERROR('Email is already taken.');

        user = new User(newUser);
        // hash the password
        user.password = await hash(password, 10);

        const result = await user.save();

        // Issues Authentication Token
        const tokens = await issueToken(user);

        return {
          user: result,
          ...tokens,
        };
      } catch (err) {
        throw new SERVER_ERROR(err.message);
      }
    },
  },
};
