import { authController } from '../../controllers';

export default {
  Query: {
    profile: authController.profile,
    users: authController.users,
    logout: authController.logout,
  },
  Mutation: {
    register: authController.register,
    login: authController.login,
    invalidateTokens: authController.invalidateTokens,
  },
};
