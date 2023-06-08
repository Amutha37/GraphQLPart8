import { useState } from 'react'

// state management
import { useField } from '../hooks'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useMutation } from '@apollo/client'
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 3px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`
const TomatoButton = styled(Button)`
  background: tomato;
`

const AddNewBookForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetPublished, ...published } = useField('text')

  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([''])
  const [showErr, setShowErr] = useState(false)

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS, ALL_AUTHORS }],
    onError: (error) => {
      console.log('Error', error)
      const errors = error.graphQLErrors[0]

      dispatch(
        setNotification(`Invalid title and author length and year: ${error}`, 5)
      )
      navigate('/create')

      // const messages = Object.values(errors)
      //   .map((e) => e.message)
      //   .join('\n')
      // console.log('messageul', messages)
      // setError(messages)
      // dispatch(setNotification(`Error adding book  : ${error}`, 5))
    },
    update: (cache, response) => {
      console.log('response', response)
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(response.data.addBook),
        }
      })
      navigate('/books')
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    //  book length validation check
    // console.log('title', title.value, title.value.length)
    // if (title.value.length < 5) return setShowErr(!showErr)

    // dispatch(
    //   setNotification(
    //     `Book title  is too short minimum length should be 5.  : ${title.value}`,
    //     5
    //   )
    // )

    console.log('im here  title check2', `${!showErr}`)
    // validate year

    const currentYear = new Date().getFullYear()
    const yearValidation = currentYear - published.value

    if (yearValidation < 0) {
      console.log('im here  year check')
      setShowErr(!showErr)
      console.log('im here  year check', `${showErr}`)
      dispatch(
        setNotification(
          `Invalid published year, check the validity of the published year.  : ${title.value}`,
          5
        )
      )
    }

    if (author.value.length < 4) {
      setShowErr(!showErr)
      console.log('im here  author check', `${showErr}`)
      dispatch(
        setNotification(
          `Author name  is too short minimum length should be 4.  : ${author.value}`,
          5
        )
      )
    }
    if (showErr) return navigate('/create')

    const newBookDetails = {
      author: author.value,
      title: title.value,
      published: Number(published.value),
      genres: genres.length > 0 ? genres : [],
    }

    console.log('ADD BOOK...', newBookDetails)

    createBook({ variables: newBookDetails })

    dispatch(
      setNotification(`Added new book list  : ${newBookDetails.title}`, 5)
    )

    resetTitle()
    resetAuthor()
    resetPublished()
    setGenres([])
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetTitle()
    resetAuthor()
    resetPublished()
    setGenres([])
    navigate('/create')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          Author :
          <Input label='author' {...author} />
        </div>
        <div>
          Title :
          <Input label='title' {...title} />
        </div>
        <div>
          Published :
          <Input label='published' {...published} />
        </div>

        {/* ADDING genres  */}
        <div>
          Genre :
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type='button'>
            add genre
          </button>
        </div>

        {genres && <div>Genres: {genres.join()}</div>}

        <Button type='submit'>ADD </Button>
        <TomatoButton onClick={handleReset}>Reset</TomatoButton>
      </form>
    </div>
  )
}

export default AddNewBookForm
