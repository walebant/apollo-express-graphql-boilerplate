import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    profile: User!
    users: [User!]!
    refreshTokens: Auth!
    login(username: String!, password: String!): Auth!
    logout: String!
  }

  extend type Mutation {
    register(
      name: String!
      username: String!
      email: String!
      password: String!
    ): Auth!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type Auth {
    user: User
    tokens: AuthTokens!
  }

  type AuthTokens {
    access: Token!
    refresh: Token!
  }

  type Token {
    token: String!
    expires: String!
  }
`;
