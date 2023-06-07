import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Footer from './components/Footer'
import SampleFlex from './components/SampleFlex'

// styling
import styled from 'styled-components'

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
  const [page, setPage] = useState('authors')

  return (
    <div id='nav_bar'>
      <Page>
        <Navigation>
          {/* <div> */}
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('add')}>add book</button>
          {/* </div> */}
        </Navigation>

        <Authors show={page === 'authors'} />

        <Books show={page === 'books'} />

        <NewBook show={page === 'add'} />
      </Page>
      <Footer />
      <SampleFlex />
    </div>
  )
}

export default App
