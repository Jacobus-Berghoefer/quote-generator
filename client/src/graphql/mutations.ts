import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
mutation login($username: String!, $password: String!) {
login(username: $username, password: $password) {
    token
    user {
      _id
      username
      email
    }
  }
}
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
      email
    }
  }
}
`;

export const SAVE_QUOTE = gql`
mutation saveQuote($text: String!, $author: String!) {
  saveQuote(text: $text, author: $author) {
    _id
    text
    author
  }
}
`;