import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    profile: User!
    users: [User!]!
    refreshTokens: Auth!
    login(username: String!, password: String!): Auth!
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
  type Tokens {
    access: String!
    refresh: String!
  }

  type Auth {
    user: User
    tokens: Tokens!
  }
`;
