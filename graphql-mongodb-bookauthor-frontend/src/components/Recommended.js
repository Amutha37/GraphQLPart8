import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { USER, ALL_BOOKS } from '../queries'

const Recommended = () => {
  const booksResult = useQuery(ALL_BOOKS)
  const userResult = useQuery(USER)

  if (booksResult.loading || userResult.loading) {
    console.log('imhere loading')
    return <div id='loading'>loading...</div>
  }
  console.log('userResult', userResult, 'booksResult', booksResult)
  const myFavourite = userResult.data.me.favouriteGenre
  const currentUser = userResult.data.me.username
  const books = booksResult.data.allBooks
  console.log(
    'userResult',
    userResult,
    myFavourite,
    userResult.data.me.username,
    'booksResult',
    booksResult,
    'books',
    books
  )
  // check for authors favourite genre

  const favouriteGenresBooks = books.filter((book) =>
    book.genres.includes(myFavourite)
  )
  console.log('favourtieGenresBooks', favouriteGenresBooks)

  return (
    <div>
      <h3>Recommendations</h3>
      <h5>
        Book list of my favourite genre <em id='favour'>{myFavourite}</em>
      </h5>

      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Published</th>
          </tr>
          {favouriteGenresBooks.map((a, id) => (
            <tr key={id}>
              <td>{a.title}</td>

              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
