import React, { useState } from "react";
import Constants from "./Utilities/Constants";
import PostCreateForm from "./components/PostCreateForm";
import PostUpdateForm from "./components/PostUpdateForm";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostForm, setShowingCreateNewPostForm] = useState(false);
  const [postBeingCurrentlyUpdate, setPostBeingCurrentlyUpdated] = useState(null);

  function getPosts() {
    const url = Constants.API_URL_GET_ALL_POSTS;
    
    fetch(url, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(postsFromServer => {
        console.log(postsFromServer);
        setPosts(postsFromServer);
      })
      .catch((error) => {
        console.log(error);
      });
    }

    function deletePost(postId) {
      const url = `${Constants.API_URL_DELETE_POST_BY_ID}/${postId}`;
     
      fetch(url, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(responseFromServer => {
          console.log(responseFromServer);
          onPostDeleted(postId);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return (
      <div className="container">
        <div className="row min-vh-100">
          <div className="col d-flex flex-column justify-content-center align-items-center>">
            {(showingCreateNewPostForm === false && postBeingCurrentlyUpdate === null) && (
              <div>
                <h1 align="center"> ASP.NET Core API React APP  </h1>
                <div className="mt-5" align="center">
                  <button onClick={getPosts} className="btn btn-dark btn-large w-100">Get Posts From Server</button>
                  <button onClick={() => setShowingCreateNewPostForm(true)} className="btn btn-dark btn-secondary w-100 mt-4">Create New Post</button>
                </div>
              </div>
            )}

            {(posts.length > 0 && showingCreateNewPostForm === false && postBeingCurrentlyUpdate === null) && renderPostsTable()}
            {showingCreateNewPostForm && <PostCreateForm onPostCreated={onPostCreated} />}
            {postBeingCurrentlyUpdate !== null && <PostUpdateForm post={postBeingCurrentlyUpdate} onPostUpdated={onPostUpdated} />}

          </div>
        </div>
      </div>
    );

    function renderPostsTable() {
      return (
        <div className="table-responsive mt-5">
          <table className="table table-bordered border-dark">
            <thead>
              <tr>
                <th scope="col">PostId (PK)</th>
                <th scope="col">Title</th>
                <th scope="col">Content</th>
                <th scope="col">CRUD Operations</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.postId}>
                  <th scope="row">{post.PostId}</th>
                  <td>{post.title}</td>
                  <td>{post.content}</td>
                  <td>
                    <button onClick={() => setPostBeingCurrentlyUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                    <button onClick={() => { if(window.confirm(`Are you sure you want to delete the post titled "${post.title}"?`)) deletePost(post.postId) }} className="btn btn-secondary btn-lg">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100">Clear the posts</button>
        </div>
      );
    }

    function onPostCreated(createdPost) {
      setShowingCreateNewPostForm(false);

      if (createdPost === null) {
        return;
      }

      alert(`Post successfully created`);

      getPosts();
    }

    function onPostUpdated(updatedPost) {
      setPostBeingCurrentlyUpdated(null);

      if (updatedPost === null) {
        return;
      }

      let postsCopy = [...posts];

      const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
        if (postsCopyPost.postId === updatedPost.postId) {
          return true;
        }
      });

      if (index !== -1) {
        postsCopy[index] = updatedPost;
      }

      setPosts(postsCopy);
      alert(`Post successfully updated`);
    }

    function onPostDeleted(deletedPostPostId) {
      let postsCopy = [...posts];
      
      const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
        if (postsCopyPost.postId === deletedPostPostId) {
          return true;
        }
      });

      if (index !== -1) {
        postsCopy.slice(index, 1);
      }

      setPosts(postsCopy);
      alert(`Post successfully deleted`);
      getPosts();
    }
  }

