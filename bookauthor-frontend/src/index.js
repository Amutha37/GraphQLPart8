// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import './App.css'
// // import { BrowserRouter as Router } from 'react-router-dom'
// import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
// import App from './App'

// const client = new ApolloClient({
//   uri: 'http://localhost:4000',
//   cache: new InMemoryCache(),
// })

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <ApolloProvider client={client}>
//     {/* <Router> */}
//     <App />
//     {/* </Router> */}
//   </ApolloProvider>
// )
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import './App.css'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <Router>
      <App />
    </Router>
  </ApolloProvider>
)
