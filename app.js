import express from 'express'
import graphqlHTTP from 'express-graphql'
import http from 'http'

import { graphql, buildSchema } from 'graphql'

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
}

// The canonical simplest graphQL server there ever was
var app = express()
const server = http.createServer(app)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))

server.listen(4000)
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
