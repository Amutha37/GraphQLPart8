import React, { useState } from 'react'

import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState('All Genres')
  const [filteredByGenreBooks, setFilteredByGenreBooks] = useState([])
  const result = useQuery(ALL_BOOKS)

  if (!result) return null

  if (result.loading) {
    return <div id='loading'>loading...</div>
  }

  console.log('result BOOKS', result)
  const books = result.data.allBooks

  // collect all the unique genres

  let allGenres = books.flatMap((b) => b.genres).concat('All Genres')
  //  collect unique genre from the list allgenres
  let uniqueGenres = [...new Set(allGenres)]

  // handle selected genre
  const handleSelectedGenre = (genre) => {
    setSelectedGenre(genre)

    setFilteredByGenreBooks(
      books.filter((book) => {
        // check for genre only
        return book.genres.includes(genre)
      })
    )
  }

  let bookList = selectedGenre === 'All Genres' ? books : filteredByGenreBooks

  return (
    <div>
      <h2>Books</h2>

      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {bookList.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id='genresList'>
        <h4>View by Genre</h4>
        {uniqueGenres.map((genre) => (
          <button key={genre} onClick={() => handleSelectedGenre(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books
