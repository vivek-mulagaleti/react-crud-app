import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      setSuccess(response.data.message + ' Redirecting to login page...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration transaction failed.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '25px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>Create New Account</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Full Name</label>
          <input type="text" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
          <input type="email" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password (min 6 chars)</label>
          <input type="password" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Register Operator</button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>Already configured? <Link to="/login">Login here</Link></p>
    </div>
  );
}

export default Signup;