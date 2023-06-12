import { useNavigate } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'

const LogOut = ({ setToken }) => {
  const navigate = useNavigate()
  const client = useApolloClient()

  setToken(null)
  localStorage.clear()
  client.resetStore()
  navigate('/')
}

export default LogOut
