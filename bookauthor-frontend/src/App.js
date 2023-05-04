import { Routes, Route, Link } from 'react-router-dom'
import styled from 'styled-components'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Home from './components/Home'
import Footer from './components/Footer'

// import { useQuery } from '@apollo/client'

// import { ALL_AUTHORS, ALL_BOOKS } from './queries'

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  text-decoration: none;
  background: BurlyWood;
  padding: 1em;
`

const App = () => {
  // const allAuthorResult = useQuery(ALL_AUTHORS)
  // const allBooksResult = useQuery(ALL_BOOKS)

  return (
    <div id='nav_bar'>
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

        {/* {notification && <Notification />} */}

        <Routes>
          <Route path='/authors' element={<Authors />} />

          <Route path='/books' element={<Books />} />

          <Route path='/create' element={<NewBook />} />

          <Route path='/' element={<Home />} />
        </Routes>
      </Page>
      <Footer />
    </div>
  )
}

export default App
