import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      navigate('/login');
    } catch (err) {
      console.error('Logout instruction failed:', err);
    }
  };

  return (
    <div>
      <nav style={{ padding: '15px 30px', background: '#2C3E50', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>📋 System Dashboard</Link>
          <Link to="/create" style={{ color: '#fff', textDecoration: 'none' }}>➕ Create post</Link>
        </div>
        <button onClick={handleLogout} style={{ background: '#E74C3C', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </nav>
      
      <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto' }}>
        <Routes>
          {/* Public Access Entry Paths */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Secure Protected CRUD Operational Environments */}
          <Route path="/" element={<ProtectedRoute><PostList /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><PostForm /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;