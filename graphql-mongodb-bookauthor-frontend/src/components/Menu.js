import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Notification from './Notification'
import styled from 'styled-components'
import Authors from './Authors'
import Books from './Books'
import NewBook from './NewBook'
import Home from './Home'
import Footer from './Footer'

import LoginForm from './LoginForm'
import SampleFlex from './SampleFlex'

import { useApolloClient } from '@apollo/client'

import { useSelector } from 'react-redux'

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  text-decoration: none;
  background: BurlyWood;
  padding: 1em;
`

const Menu = () => {
  const [token, setToken] = useState(null)
  const notification = useSelector((state) => state.notification)
  const client = useApolloClient()

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        <LoginForm setToken={setToken} />
      </div>
    )
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div id='nav_bar'>
      <button onClick={logout}>logout</button>
      <Page>
        <Navigation>
          <Link className='link' to='/'>
            Home
          </Link>

          <Link className='link' to='/authors'>
            Authors
          </Link>

          <Link className='link' to='/books'>
            Books
          </Link>
          <Link className='link' to='/create'>
            Add Book
          </Link>
        </Navigation>
        <button id='logOut' onClick={logout}>
          Log Out
        </button>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/authors' element={<Authors />} />

          <Route path='/books' element={<Books />} />

          <Route path='/create' element={<NewBook />} />
          {/* <Route onClick={logout} /> */}
        </Routes>

        {notification && <Notification />}
      </Page>
      <Footer />
      <SampleFlex />
    </div>
  )
}

export default Menu
