import { find } from 'lodash'

// Mock database ====
const agents = [
  { id: 1, firstName: 'Larry', middleInitial: 'L', lastName: 'Thomas'},
  { id: 2, firstName: 'Bill', middleInitial: 'R', lastName: 'Lewis' }
]

const authors = [
  { id: 1, firstName: 'Tom', middleInitial: 'W',lastName: 'Coleman'},
  { id: 2, firstName: 'Sashko', middleInitial: 'L', lastName: 'Stubailo'},
  { id: 3, firstName: 'Mikhail', middleInitial: 'R', lastName: 'Novikov' },
]

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL',articleType: 1 },
  { id: 2, authorId: 2, title: 'GraphQL Rocks', articleType:  2 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', articleType: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', articleType: 3 },
]

export { agents, authors, posts }
