import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [selectedRole, setSelectedRole] = useState('customer');
  const navigate = useNavigate();

  const handleNavigate = (type) => {
    localStorage.setItem('selectedRole', selectedRole);
    navigate(`/${type}`);
  };

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '80px', position: 'relative', zIndex: 1 }}>
      <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#0d6efd' }}>
        Welcome to <span style={{ color: '#28a745' }}>Shopiverse</span>
      </h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#555' }}>
        Select your role to login or sign up
      </p>

      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            width: '250px'
          }}
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button onClick={() => handleNavigate('login')}>Login</button>
        <button onClick={() => handleNavigate('signup')}>Signup</button>
      </div>

      {/* Floating Icons */}
      {/* <img src="/icons/shopping-bag.png" className="bg-icon bg-icon-1" alt="icon" />
      <img src="/icons/shopping_cart.png" className="bg-icon bg-icon-2" alt="icon" />
      <img src="/icons/vendor.jpeg" className="bg-icon bg-icon-3" alt="icon" />
      <img src="/icons/admin.jpeg" className="bg-icon bg-icon-4" alt="icon" />
      <img src="icons/customer.jpeg" className="bg-icon bg-icon-5" alt="icon" /> */}
    </div>
  );
};

export default LandingPage;
