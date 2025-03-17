import { gql } from '@apollo/client';

export const GET_QUOTES_BY_KEYWORD = gql`
query ZenQuoteByKeyword($keyword: String!) {
  zenQuoteByKeyword(keyword: $keyword) {
    text
    author
    characterCount
    htmlFormatted
  }
}`

export const GET_TODAY_QUOTE = gql`
query ZenToday {
    zenQuoteToday {
        text
        author
    }
}
`

export const GET_RANDOM_QUOTE = gql`
query ZenRandom {
    zenQuoteRandom {
        text
        author
    }
}
`

export const GET_ALL_QUOTES = gql`
query ZenAll {
    zenQuotes {
        text
        author
    }
}
`