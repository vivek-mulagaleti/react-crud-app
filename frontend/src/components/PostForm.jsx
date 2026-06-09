import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000/posts';

function PostForm() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { id } = useParams(); // If ID exists, we are in EDIT mode
  const navigate = useNavigate();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/${id}`);
          setTitle(response.data.title);
          setBody(response.data.body);
        } catch (err) {
          setError('Failed to load post details.');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      setError('All fields are required.');
      return;
    }

    const postData = { title, body };

    try {
      setLoading(true);
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, postData);
      } else {
        await axios.post(API_URL, { ...postData, id: Date.now().toString() });
      }
      navigate('/');
    } catch (err) {
      setError('Something went wrong while saving the post.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) return <p className="loading">Loading data...</p>;

  return (
    <div>
      <h2>{isEditMode ? 'Edit Post' : 'Create Post'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            disabled={loading}
          />
        </div>
        <div>
          <label>Body</label>
          <textarea 
            rows="5" 
            value={body} 
            onChange={(e) => setBody(e.target.value)}
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? 'Saving...' : isEditMode ? 'Update Post' : 'Create Post'}
        </button>
        <button type="button" className="btn" onClick={() => navigate('/')} disabled={loading}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default PostForm;