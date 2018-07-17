import { find, filter } from 'lodash'
import { authors, posts, agents } from './data'

const resolvers = {
  Query: {
    posts: () => posts,
    authors: () => authors,
    agents: () => agents,
    people: () => authors.concat(agents),
    agent: (_, args) => find(agents,{ id: args.id }),
    author: (_, args) => find(authors, { id: args.id }),
    post: (_, args) => find(posts, { id: args.id })
  },
  Author: {
    posts: (author) => filter(posts, { author: { author } }),
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

export { resolvers }
