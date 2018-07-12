import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema, execute, subscribe } from 'graphql'
import { find, filter } from 'lodash';
import { makeExecutableSchema } from 'graphql-tools'
import { createServer } from 'http'

// These imports support the subscription functionality
import { graphiqlExpress } from 'graphql-server-express'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { PubSub } from 'graphql-subscriptions'

// Set up data structures for subscription management
const pubsub = new PubSub()
const POST_ADDED_TOPIC = 'postAdded'

// We'll serve on port 4000
const PORT = 4000

// init express app and http server
var app = express()
// const server = http.createServer(app)

// Bring in our mock data
import { agents, authors, posts } from "./data"

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
    id: Int!
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

  # The subscription root type, specifying what we can subscribe to
  type Subscription {
      postAdded: Post
  }
`

const resolvers = {
  Query: {
    posts: () => posts,
    authors: () => authors,
    agents: () => agents,
    people: () => authors.concat(agents),
    agent: (_, args) => find(agents,{ id: args.id }),
    author: (_, args) => find(authors, { id: args.id }),
  },

  Mutation: {
    createPost: (_, {input}) => {
      // Build new post object from input values

      // "id" is sequential index into "posts" array
      let id = posts.length + 1

      // Extract values from input data
      let thisTitle = input["title"]
      let thisArticleType = input["articleType"]
      let thisAuthor = input["authorId"]

      let newPost = {id: id, title: thisTitle, authorId: thisAuthor, articleType: thisArticleType}
      posts.push(newPost)
      // Notify subscribers
      pubsub.publish(POST_ADDED_TOPIC, { postAdded: newPost });  // publish to a topic
      return newPost
      },
    },

  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(POST_ADDED_TOPIC)  // subscribe to new posts
    }
  },

  Author: {
    posts: (author) => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: (post) => find(authors, { id: post.authorId }),
  },
  Agent: {
    represents: (agent) => filter(authors, { agent: agent})
  },
	Person: {
    // This code differentiates between the two implementations of Person
    // It is required because objects returned from the "people" query
    //    must be defined types, not interface types
    __resolveType(data, context, info) {
		  if (data.agent) {
        return 'Author'
      } else {
        return 'Agent'
      }
    }
  },
}

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
