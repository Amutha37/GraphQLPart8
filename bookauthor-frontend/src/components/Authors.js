import React from 'react'
import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

import ChangeAuthorBirthYear from './ChangeAuthorBirthYear'

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div id='loading'>loading...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCounts}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* birth year change form  */}

      <ChangeAuthorBirthYear />
    </div>
  )
}

export default Authors
