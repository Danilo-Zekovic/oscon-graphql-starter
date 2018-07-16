import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

//  Query as it is in GraphiQL
const GET_POSTS = gql`
  {
    posts {
      id
      title
      author {
        firstName
        lastName
      }
    }
  }
`;
/*
Query Apollo Client component for doing queries, has many options.
Query is the query it self.
Pollinterval is saying how often to check for changes, 0 means never.
Loading and error are boolean, when either of them is true we can display different screens.
data is what query returns.
*/
const Posts = ({ props }) => (
  <Query
    query={GET_POSTS}
    pollInterval={500}
    >
    {({ loading, error, data }) => {
      if (loading) return "Loading...";
      if (error) return `Error! ${error.message}`;

      return (
        <div>
          <h2>All Posts</h2>
          <div className="posts">
            {data.posts.map(post => (
              <div key={post.id}>
                <h3>{post.title}</h3>
                <h5>{post.author.firstName} {post.author.lastName}</h5>
              </div>

            ))}
          </div>
        </div>
      );
    }}
  </Query>
);

export default Posts
