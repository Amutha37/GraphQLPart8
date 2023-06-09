import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Notification from './Notification'
import styled from 'styled-components'
import Authors from './Authors'
import Books from './Books'
import AddNewBookForm from './AddNewBookForm'
import Home from './Home'
import Recommended from './Recommended'

import Logout from './Logout'
import Footer from './Footer'

import LoginForm from './LoginForm'
import SampleFlex from './SampleFlex'

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

  return (
    <div id='nav_bar'>
      <Page>
        <Navigation>
          <Link className='link' to='/'>
            Home
          </Link>

          <Link className='link' to='/favouriteGenre'>
            Recommend
          </Link>

          <Link className='link' to='/authors'>
            Authors
          </Link>

          <Link className='link' to='/books'>
            Books
          </Link>
          <Link className='link' to='/create'>
            AddBook
          </Link>

          {token ? (
            <Link className='link' id='logout' to='/logout'>
              LogOut
            </Link>
          ) : (
            <Link className='link' id='login' to='/login'>
              LogIn
            </Link>
          )}
        </Navigation>

        {notification && <Notification />}

        <Routes>
          <Route path='/' element={<Home />} />

          <Route path='/favouriteGenre' element={<Recommended />} />

          <Route path='/authors' element={<Authors />} />

          <Route path='/books' element={<Books />} />

          <Route path='/create' element={<AddNewBookForm />} />

          <Route path='/logout' element={<Logout setToken={setToken} />} />

          <Route path='/login' element={<LoginForm setToken={setToken} />} />
        </Routes>
      </Page>
      <Footer />
      <SampleFlex />
    </div>
  )
}

export default Menu
