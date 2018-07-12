import express from 'express'
import graphqlHTTP from 'express-graphql'
import http from 'http'

// The simplest express server on earth
var app = express();
const server = http.createServer(app)

app.get('/', (req, res) => res.send('Hello World!'))

server.listen(4000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
