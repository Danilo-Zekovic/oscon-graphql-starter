import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import http from 'http'

// Get data
import { authors, posts } from "./data"

// Get resolvers
import { resolvers } from './resolvers'

// init express app and http server
var app = express();
const server = http.createServer(app)

const typeDefs =
`
  enum PostType {
    NEWS
    SPORTS
    OPINION
    REVIEW
    ANALYSIS
    TECHNICAL
	}

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
    articleType: PostType
  }

  type Query {
    posts: [Post]
    post(id: Int!): Post
    authors: [Author]
    author(id: Int!): Author
  }

`

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}));

server.listen(4000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
