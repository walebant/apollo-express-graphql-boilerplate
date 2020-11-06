import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    profile: User
    user: [User!]!
    token: String!
    refreshToken: String!
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
    createdAt: String!
    updatedAt: String!
  }

  type Auth {
    user: User
    token: String!
    refreshToken: String!
  }
`;
