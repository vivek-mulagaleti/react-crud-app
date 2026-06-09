import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import PostForm from './components/PostForm';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home (Post List)</Link>
        <Link to="/create">Create New Post</Link>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<PostForm />} />
          <Route path="/edit/:id" element={<PostForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;