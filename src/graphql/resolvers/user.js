import { authController } from '../../controllers';

export default {
  Query: {
    profile: authController.profile,
    users: authController.users,
  },
  Mutation: {
    register: authController.register,
    login: authController.login,
    logout: authController.logout,
    invalidateTokens: authController.invalidateTokens,
  },
};
