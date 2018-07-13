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

  type Query {
    posts: [Post]
    authors: [Author]
    agents: [Agent]
    people: [Person]
    author(id: Int!): Author
    agent(id: Int!): Agent
  }

  input PostInput {
    title: String
    authorId: Int
    articleType: PostType
}

  type Mutation {
      createPost(input: PostInput): Post
    }
`;

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
      return newPost
    },
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
};

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
