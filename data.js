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
  { id: 1, author: find(authors, { id: 1 }), title: 'Introduction to GraphQL',articleType: 'REVIEW' },
  { id: 2, author: find(authors, { id: 2 }), title: 'GraphQL Rocks', articleType:  'OPINION' },
  { id: 3, author: find(authors, { id: 2 }), title: 'Advanced GraphQL', articleType: 'TECHNICAL' },
  { id: 4, author: find(authors, { id: 3 }), title: 'Launchpad is Cool', articleType: 'OPINION' },
]

export { agents, authors, posts }
