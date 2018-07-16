import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

// mutation as it is in GraphiQL
const ADD_POST = gql`
mutation createPost($title:String, $authorId:Int, $articleType:PostType ){
  createPost(input:{title:$title, authorId:$authorId, articleType:$articleType}){
    title
  }
}
`;

/*
Mutation Apollo Client component for doing mutations, has many options.
Mutation is the mutation it self.
createPost is the mutaton that needs to be called
Loading and error are boolean, when either of them is true we can display different screens.
*/

const AddPost = () => {
  let title, authorId, articleType

  return (
    <Mutation mutation={ADD_POST}>
      {(createPost, { loading, error }) => (
        <div>
          <h2>Add Post </h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              createPost({ variables: { title: title.value, authorId: authorId.value, articleType:articleType.value } });
              title.value = "";
              authorId.value = "";
              articleType.value = "";

            }}
          >
            <input placeholder="Title"
              ref={node => {
                title = node;
              }}
            />
            <input placeholder="Author"
              ref={node => {
                authorId = node;
              }}
            />

            <select ref={node=> {articleType = node;}}>
              <option value="" disabled selected>Article Type</option>
              <option value="NEWS">News</option>
              <option value="SPORTS">Sports</option>
              <option value="OPINION">Opinion</option>
              <option value="REVIEW">Review</option>
              <option value="ANALYSIS">Analysis</option>
              <option value="TECHNICAL">Technical</option>
            </select>
            <button className="btn" type="submit">Add Post</button>
          </form>
          {loading && <p>Loading...</p>}
          {error && <p>Error :( Please try again</p>}
        </div>
      )}
    </Mutation>
  );
};

export default AddPost
