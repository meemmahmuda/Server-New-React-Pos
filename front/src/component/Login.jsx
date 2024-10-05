import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simply redirect to the dashboard page without any authentication logic
    navigate('/dashboard');
  };

  return (
    <div style={{
      backgroundColor: '#f7f7f7', // Light background color for the entire page
      height: '100vh', // Full height to cover the page
      display: 'flex', // Center the login form
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%', // Full width for responsiveness
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', // Shadow effect
        backgroundColor: '#fff'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#666' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '5px'
              }}
            />
          </div>
          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Login
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>Don't have an account? <a href="/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
