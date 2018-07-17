import { find, filter } from 'lodash'
import { authors, posts, agents } from './data'

const resolvers = {
  Query: {
    posts: () => posts,
    authors: () => authors,
    author: (_, args) => find(authors, { id: args.id }),
    post: (_, args) => find(posts, { id: args.id})
  },
  Author: {
    posts: (author) => filter(posts, { author: author }),
  },

}

export { resolvers }
