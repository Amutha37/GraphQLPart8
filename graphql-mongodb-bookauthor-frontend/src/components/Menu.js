import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Notification from './Notification'
import styled from 'styled-components'
import Authors from './Authors'
// import Books from './Books'
import Books from './Books'
import AddNewBookForm from './AddNewBookForm'
import Home from './Home'
import Recommended from './Recommended'

import Logout from './Logout'
import Footer from './Footer'

import LoginForm from './LoginForm'
import SampleFlex from './SampleFlex'

import { useSelector } from 'react-redux'
import { useApolloClient } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

  const renderLink = () => {
    return (
      <>
        <Link className='link' to='/recommend'>
          Recommended
        </Link>
        <Link className='link' to='/create'>
          AddBook
        </Link>

        {/* <Link className='link' id='logout' to='/logout'>
          LogOut
        </Link> */}
      </>
    )
  }

  console.log('token', token)

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/')
  }
  return (
    <div id='nav_bar'>
      <Page>
        <Navigation>
          <Link className='link' to='/'>
            Home
          </Link>

          <Link className='link' to='/books'>
            Books
          </Link>
          <Link className='link' to='/authors'>
            Authors
          </Link>

          {token && renderLink()}

          {!token && (
            <Link className='link' id='login' to='/login'>
              LogIn
            </Link>
          )}
          {token && (
            <button id='logout' onClick={logout}>
              Logout
            </button>
          )}
        </Navigation>

        {notification && <Notification />}

        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/recommend' element={<Recommended />} />

          <Route path='/authors' element={<Authors token={token} />} />

          <Route path='/books' element={<Books />} />

          <Route path='/create' element={<AddNewBookForm />} />
          {/* 
          <Route path='/logout' element={<Logout setToken={setToken} />} /> */}

          <Route path='/login' element={<LoginForm setToken={setToken} />} />
        </Routes>
      </Page>
      <Footer />
      <SampleFlex />
    </div>
  )
}

export default Menu
