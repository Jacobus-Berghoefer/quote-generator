import { gql } from 'apollo-server-express';

export const typeDefs = gql`
# user model to store user data and their saved quotes

  type user{
  _id: ID!
  username: String!
  email: String!
  password: String!
  savedQuotes: [Quote]
  }

# Quote model to store quote data

  type Quote {
    _id: ID!
    content: String!
    author: String!
    createdAt: String!
  }

# auth type for returning data from authentication mutations

  type Auth {
    token: ID!
    user: user
  }

  # Root query type for all queries

  type Query {
  me: user
  quotes: [Quote]
  quote(_id: ID!): Quote
  }

# Root mutation type

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveQuote(content: String!, author: String!): Quote
    removeQuote(_id: ID!): Quote
    getRandomQuote: Quote
    }
`;