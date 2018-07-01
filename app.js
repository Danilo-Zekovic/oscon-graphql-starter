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
const agents = [
  { id: 1, firstName: 'Larry', middleInitial: 'L', lastName: 'Thomas'},
  { id: 2, firstName: 'Bill', middleInitial: 'R', lastName: 'Lewis' }
]

const authors = [
  { id: 1, firstName: 'Tom', middleInitial: 'W',lastName: 'Coleman', agent: find(agents,{id: 1})},
  { id: 2, firstName: 'Sashko', middleInitial: 'L', lastName: 'Stubailo', agent: find(agents,{id: 2})},
  { id: 3, firstName: 'Mikhail', middleInitial: 'R', lastName: 'Novikov', agent: find(agents, {id: 1}) },
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL',articleType: 'REVIEW' },
  { id: 2, authorId: 2, title: 'GraphQL Rocks', articleType:  'OPINION' },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', articleType: 'TECHNICAL' },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', articleType: 'OPINION' },
];

// ====

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
    posts: [Post]
		agent: Agent
  }

  type Agent implements Person {
    id: ID!
		firstName: String
	  middleInitial: String
    lastName: String
		represents: [Author]
	}

	type Post {
    id: Int!
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
  rootValue: global,
  graphiql: true,
}));

server.listen(4000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
