import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Quote {
    id: ID!
    text: String!
    author: String!
    category: String
  }

  type Query {
    getSavedQuotes: [Quote]
  }

  type Mutation {
    saveQuote(text: String!, author: String!, category: String): Quote
  }
`;
