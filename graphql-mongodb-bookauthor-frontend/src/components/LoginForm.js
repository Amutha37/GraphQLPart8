import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { setNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { LOGIN } from '../queries'
import { useNavigate } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('secret')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const client = useApolloClient()

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      dispatch(
        setNotification(`Login error ${error.graphQLErrors[0].message}`, 5)
      )

      // setError(error.graphQLErrors[0].message)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('book-user-token', token)
    }
  }, [result.data]) // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
    console.log('login', login)
    navigate('/books')
  }
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <button onClick={logout}>logout</button>

      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
