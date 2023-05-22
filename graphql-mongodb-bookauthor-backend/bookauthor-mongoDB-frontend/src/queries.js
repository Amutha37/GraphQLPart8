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
      author
      title
      published
      genres
      id
    }
  }
`

// export const FIND_PERSON = gql`
//   query findPersonByName($nameToSearch: String!) {
//     findPerson(name: $nameToSearch) {
//       name
//       phone
//       id
//       address {
//         street
//         city
//       }
//     }
//   }
// `
// check genres need []
export const CREATE_BOOK = gql`
  mutation createBook(
    $author: String!
    $title: String!
    $published: Int!
    $genres: [String]
  ) {
    addBook(
      author: $author
      title: $title
      published: $published
      genres: $genres
    ) {
      author
      title
      published
      id
      genres
    }
  }
`
