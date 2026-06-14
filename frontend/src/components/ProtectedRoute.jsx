import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState({ checking: true, isAuthenticated: false });

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/me')
      .then(res => {
        if (res.data.isAuthenticated) {
          setAuth({ checking: false, isAuthenticated: true });
        } else {
          setAuth({ checking: false, isAuthenticated: false });
        }
      })
      .catch(() => setAuth({ checking: false, isAuthenticated: false }));
  }, []);

  if (auth.checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <h3>Verifying system security access clearance...</h3>
      </div>
    );
  }

  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;