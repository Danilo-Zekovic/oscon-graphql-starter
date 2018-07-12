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
import { authors, agents, posts } from './data'

// ====

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
    id: Int!
    title: String
    author: Author
    articleType: String
  }

  type Query {
    posts: [Post]
    authors: [Author]
    author(id: Int!): Author
  }
`;

const resolvers = {
  Query: {
    posts: () => posts,
    authors: () => authors,
    author: (_, args) => find(authors, { id: args.id }),
  },
  Author: {
    posts: (author) => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: (post) => find(authors, { id: post.authorId }),
  },
};

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
