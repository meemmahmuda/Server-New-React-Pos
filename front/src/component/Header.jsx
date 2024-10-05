import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simulate logout action
    navigate('/');
  };

  return (
<header style={{ padding: '10px', background: '#f8f9fa', textAlign: 'right', marginBottom: '20px' }}>
  <button 
    onClick={handleLogout} 
    style={{ 
      padding: '8px 16px', 
      cursor: 'pointer', 
      backgroundColor: 'red', 
      color: '#fff', 
      border: 'none', 
      borderRadius: '4px' 
    }}
  >
    Logout
  </button>
</header>

  );
};

export default Header;