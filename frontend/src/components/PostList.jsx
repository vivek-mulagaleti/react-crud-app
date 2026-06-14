import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_URL = 'http://localhost:5000/api/posts';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch posts. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setPosts(posts.filter((post) => post.id !== id));
      } catch (err) {
        alert('Failed to delete the post.');
      }
    }
  };

  if (loading) return <p className="loading">Loading posts...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-item">
            <div>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
            <div>
              <button className="btn btn-primary" onClick={() => navigate(`/edit/${post.id}`)}>Edit</button>
              <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;