import express from 'express'
import graphqlHTTP from 'express-graphql'
import http from 'http'
import { buildSchema } from 'graphql'
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';

// init express app and http server
var app = express();
const server = http.createServer(app)

// Get our mock data
import { authors, posts } from './data'

// Get resolvers
import { resolvers } from './resolvers'

const typeDefs =
`
  type Author {
    id: ID!
    firstName: String
    middleInitial: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: ID!
    title: String
    author: Author
    articleType: String
  }

  type Query {
    posts: [Post]
    authors: [Author]
    author(id: Int!): Author
    post(id: Int!): Post
  }
`;

// Compile schema
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Provide a graphQL-only endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

server.listen(4000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
