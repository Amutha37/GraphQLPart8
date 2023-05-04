import { useState, useEffect } from 'react'
import { useField } from '../hooks'
import { useMutation } from '@apollo/client'

import { useNavigate } from 'react-router-dom'

// state management
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

import { EDIT_BIRTH } from '../queries'
import styled from 'styled-components'

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

const ChangeAuthorBirthYear = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { reset: resetName, ...name } = useField('text')
  const { reset: resetBirth, ...born } = useField('text')

  const [changeBirth, result] = useMutation(EDIT_BIRTH)

  useEffect(() => {
    if ((result.data && result.data.editAuthor) === null) {
      dispatch(setNotification(`person not found : ${name.value}`, 5))
    }
    console.log('result data', name)
  }, [result.data, name]) // eslint-disable-line

  const handleSubmit = async (event) => {
    event.preventDefault()

    const newBirthYear = {
      name: name.value,
      born: Number(born.value),
    }

    changeBirth({ variables: newBirthYear })

    navigate('/authors')

    resetName()
    resetBirth()
  }

  return (
    <div>
      <h2>change number</h2>

      <form onSubmit={handleSubmit}>
        <div>
          Author :
          <Input label='name' {...name} />
        </div>
        <div>
          Published :
          <Input label='born' {...born} />
        </div>

        <button type='submit'>change birth year </button>
      </form>
    </div>
  )
}

export default ChangeAuthorBirthYear
