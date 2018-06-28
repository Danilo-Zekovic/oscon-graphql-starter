import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import http from 'http'

// init express app and http server
var app = express();
const server = http.createServer(app)

// Fake database ====
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

// ====

const typeDefs = `
  type Author {
    id: Int!
    firstName: String
    middle: String
    lastName: String
    posts: [Post]
  }

  type Post {
    id: Int!
    title: String
    author: Author
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

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true,
}));

server.listen(4000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
