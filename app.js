import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import http from 'http'

// Fake data
const authors = [
  { id: 1, firstName: 'Tom', middle: 'William',lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', middle: 'Lester', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', middle: 'Leo', lastName: 'Novikov' },
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL' },
  { id: 2, authorId: 2, title: 'GraphQL Rocks' },
  { id: 3, authorId: 2, title: 'Advanced GraphQL' },
  { id: 4, authorId: 3, title: 'Amazing GraphQL' },
  { id: 5, authorId: 1, title: 'Get Started with Apollo'},
];

// TODO: GraphQL queries schemas...



var app = express();
const server = http.createServer(app)

// TODO: app use GraphQL


server.listen(4000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
