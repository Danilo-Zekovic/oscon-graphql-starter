import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema, execute, subscribe } from 'graphql'
import { find, filter } from 'lodash'
import { createServer } from 'http'

// graphql.js JavaScript schema objects
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLID
} from 'graphql'

// We'll serve on port 4000
const PORT = 4000

// init express app and http server
var app = express()
const server = createServer(app)


// Bring in our mock data
import { agents, authors, posts } from "./data"

// And the resolvers
// import { resolvers } from './resolvers'

const PostTypeEnum = new GraphQLEnumType({
  name: 'PostTypeEnum',
  description: 'Various types of content for a given post',
  values: {
    NEWS: {
      value: 1,
      description: 'News story',
    },
    SPORTS: {
      value: 2,
      description: 'A rare type of post',
    },
    OPINION: {
      value: 3,
      description: 'Everybody has one',
    },
  }
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'A single post by a single author',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID),
          resolve: (root, args, context, info) => {
            return root.id
            }
          },
    title: { type: new GraphQLNonNull(GraphQLString),
              resolve: (root, args, context, info) => {
                return root.title
                }
              },
    authorId: { type: new GraphQLNonNull(GraphQLInt),
               resolve: (root, args, context, info) => {
                 return root.authorId
                }
              },
    articleType: { type: PostTypeEnum,
                  // No resolver!!!  It's automatic!!
                  }
          }
  })

  const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'A single post by a single author',
    fields: {
      id: { type: new GraphQLNonNull(GraphQLID),
            resolve: (root, args, context, info) => {
              return root.id
              }
            },
      firstName: { type: new GraphQLNonNull(GraphQLString),
                   resolve: (root, args, context, info) => {
                     return root.firstName
                   }
                },
      middleInitial: { type: new GraphQLNonNull(GraphQLString),
                       resolve: (root, args, context, info) => {
                         return root.middleInitial
                          }
                      },
      lastName: { type: new GraphQLNonNull(GraphQLString),
                  resolve: (root, args, context, info) => {
                   return root.lastName
                  }
                },
      posts: { type: new GraphQLList(PostType),
                resolve: (root, args, context, info) => {
                  return filter(posts, { authorId: root.id })
                    }
            }
          }
        })

const mySchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Query authors and posts',
      fields: {
        posts: {
          type: new GraphQLList(PostType),
          args: {},
          resolve: (root, args, context, info) => {
            return posts // Looking for all posts
          }
        },
        author: {
          type: AuthorType,
          args: { id: { type: GraphQLInt } },
          resolve: (root, args, context, info) => {
            return find(authors, { id: args.id })
          }
        },
        post: {
          type: PostType,
          args: { id: { type: GraphQLInt } },
          resolve: (root, args, context, info) => {
            return find(posts, { id: args.id })
          }
        },
        authors: {
          type: new GraphQLList(AuthorType),
          args: {},
          resolve: (root, args, context, info) => {
            return authors
          }
        }
      }
  })
})

app.use('/graphql', graphqlHTTP({
  schema: mySchema,
  graphiql: true,
}))

server.listen(4000);
console.log(
  'Express server listening on port %d in %s mode',
  server.address().port, app.settings.env
)
