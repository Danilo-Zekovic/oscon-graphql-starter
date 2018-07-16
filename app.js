import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql'
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools';
import http from 'http'

// init express app and http server
var app = express();
const server = http.createServer(app)

// Get mock data
import { authors, agents, posts } from "./data"

// Get resolvers
import { resolvers } from './resolvers'

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
    # This is a derived field
    agent: Agent
  }

  type Agent {
    id: ID!
    firstName: String
    middleInitial: String
    lastName: String
    represents: [Author]
  }

  union People = Author | Agent

  type Post {
    id: ID!
    title: String
    author: Author
    articleType: PostType
  }

  type Query {
    posts: [Post]
    authors: [Author]
    agents: [Agent]
    people: [People]
    author(id: Int!): Author
    agent(id: Int!): Agent
  }
`;

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
