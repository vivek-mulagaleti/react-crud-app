import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/login', { email, password });
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication processing error.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>System Core Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Security Password</label>
          <input type="password" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Authenticate Entry</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>New deployment operator? <Link to="/signup">Register Here</Link></p>
    </div>
  );
}

export default Login;