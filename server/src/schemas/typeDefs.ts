import { gql } from "graphql-tag";

export const typeDefs = gql`
# user model to store user data and their saved quotes

  type User{
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedQuotes: [Quote]
  }

# MongoDB Quote model to store quote data

  type Quote {
    _id: ID!
    text: String!
    author: String!
    createdAt: String!
  }

# ZenQuotes API response model
  type ZenQuote {
    text: String!
    author: String!
    characterCount: Int
    htmlFormatted: String
  }

# auth type for returning data from authentication mutations

  type Auth {
    token: ID!
    user: User
  }

  # Root query type for all queries

  type Query {
    me: User
    quotes: [Quote]
    zenQuotes: [ZenQuote]
  }

# Root mutation type

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveQuote(text: String!, author: String!): Quote
    removeQuote(_id: ID!): Quote
  }
`;