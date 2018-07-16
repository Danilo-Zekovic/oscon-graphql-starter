import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import {BrowserRouter as Router, Route} from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// GraphQL endpoint
const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })

// link and cache are requeiered
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

/*
ApolloProvider wraps React components, should be as high in hiarachi
Provides client to queries and mutations
Queries and mutations cannot be called in components outside of ApolloProvider
*/
ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact path='/' component={App} />
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
)
registerServiceWorker();
