import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    profile: User!
    users: [User!]!
    logout: String!
  }

  extend type Mutation {
    register(
      name: String!
      username: String!
      email: String!
      password: String!
    ): Auth!
    login(username: String!, password: String!): Auth!
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
    access: String!
    refresh: String!
  }
`;
