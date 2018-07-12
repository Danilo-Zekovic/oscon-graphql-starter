import { find } from "lodash"

// "Mock" database is simply programmer-deined data ====
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

export { agents, authors, posts }
