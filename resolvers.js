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
    posts: (author) => filter(posts, { authorId: author.id }),
  },
  Post: {
    author: (post) => find(authors, { id: post.authorId }),
  },
};

export { resolvers }
