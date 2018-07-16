import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema, execute, subscribe } from 'graphql'
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools'
import { createServer } from 'http'
import cors from 'cors'

// These imports support the subscription functionality
import { graphiqlExpress } from 'graphql-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'

// We'll serve on port 4000
const PORT = 4000

// init express app and http server
var app = express()
/* because our front end runns on diferet origin we need to enable cors */
app.use(cors()) // not having cors enabled will cause an access control error

// Bring in our mock data
import { agents, authors, posts } from "./data"

// And the resolvers
import { resolvers } from './resolvers'

const typeDefs =
`
  interface Person {
    id: ID!
    firstName: String
    middleInitial: String
    lastName: String
  }

  enum PostType {
    NEWS
    SPORTS
    OPINION
    REVIEW
    ANALYSIS
    TECHNICAL
	}

  type Author implements Person {
    id: ID!
    firstName: String
    middleInitial: String
    lastName: String

    # Fields unique to the implemented type
    posts: [Post]
    # This is a derived field
    agent: Agent
  }

  type Agent implements Person {
    id: ID!
    firstName: String
    middleInitial: String
    lastName: String
    # Field unique to this implemented type
    represents: [Author]
  }

  type Post {
    id: ID!
    title: String
    author: Author
    articleType: PostType
  }

  input PostInput {
    title: String
    authorId: Int
    articleType: PostType
  }

  type Query {
    posts: [Post]
    authors: [Author]
    agents: [Agent]
    people: [Person]
    author(id: Int!): Author
    agent(id: Int!): Agent
  }

  type Mutation {
      createPost(input: PostInput): Post
    }

  # The subscription type
  # Specifies possible pub-sub events
  type Subscription {
      postAdded: Post
  }
`
// Create the schema object used below
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}))

// Use subscription-aware wrapper around graphiQL
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`
}));

// Wrap the express server in order to honor subscriptions
const ws = createServer(app)
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`)

  // Set up the WebSocket for handling graphQL subscriptions.
  new SubscriptionServer({
    execute,
    subscribe,
    schema
    }, {
    server: ws,
    path: '/subscriptions',
  })
})
