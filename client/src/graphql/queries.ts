import { gql } from '@apollo/client';

export const GET_QUOTES = gql`
query ZenQuotes($value: String!) {
    zenQuotes(value: $value) {
      text
      author
    }
  }`