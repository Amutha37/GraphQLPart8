import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCounts
      id
    }
  }
`
//   Edit birt year
export const EDIT_BIRTH = gql`
  mutation editAuthor($name: String!, $born: Int) {
    editAuthor(name: $name, born: $born) {
      name
      born
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      author {
        name
      }
      title
      published
      genres
    }
  }
`

// check genres need []
export const CREATE_BOOK = gql`
  mutation createBook(
    $author: String!
    $title: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      author: $author
      title: $title
      published: $published
      genres: $genres
    ) {
      author {
        name
        born
      }
      title
      title
      published
      genres
    }
  }
`

export const USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

// Define a mutation for logging in:

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
