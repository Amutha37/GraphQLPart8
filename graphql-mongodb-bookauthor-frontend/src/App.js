import React from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'

import { ALL_BOOKS, BOOK_ADDED } from './queries'

import Menu from './components/Menu'
import { setNotification } from './reducers/notificationReducer'
import { useDispatch } from 'react-redux'

export const updateCache = (cache, query, addedBook) => {
  console.log('addedBook', addedBook)
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      console.log('item', item, item.title)

      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const client = useApolloClient()
  const dispatch = useDispatch()

  console.log('client', client, 'App')
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log('data', data)
      const addedBook = data.data.bookAdded
      // console.log('addedbook', addedBook)
      dispatch(setNotification(`New book list successfully added.`, 5))
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  return (
    <div>
      <Menu />
    </div>
  )
}

export default App
