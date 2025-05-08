import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '', role: 'customer' });
  const navigate = useNavigate();

  const signupHandler = async () => {
    await axios.post('/api/auth/signup', form);
    navigate('/login');
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: 'auto', paddingTop: '50px' }}>
      <h2 style={{ color: '#0d6efd', textAlign: 'center' }}>📝 Signup</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>
        <button onClick={signupHandler}>Signup</button>
      </div>
    </div>
  );
};

export default Signup;
