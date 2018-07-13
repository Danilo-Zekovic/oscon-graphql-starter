import { find } from 'lodash'
import { authors, posts, agents } from './data'

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

export { resolvers }
