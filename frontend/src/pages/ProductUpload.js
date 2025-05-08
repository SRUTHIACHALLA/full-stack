import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // ✅ import base URL

const ProductUpload = () => {
  const [form, setForm] = useState({ title: '', price: '', category: '', description: '' });
  const [image, setImage] = useState(null);

  const upload = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Login required to upload products.");
      return;
    }

    if (!image || !form.title || !form.price) {
      alert("Please fill all required fields and select an image.");
      return;
    }

    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      data.append('image', image);

      await axios.post(`${API_BASE_URL}/api/vendor/upload`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Product uploaded successfully');
      setForm({ title: '', price: '', category: '', description: '' });
      setImage(null);
    } catch (err) {
      console.error('❌ Upload failed:', err.response?.data || err.message);
      alert('Failed to upload product.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: 'auto', paddingTop: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🛠️ Upload Product</h2>
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        style={inputStyle}
      />
      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={e => setForm({ ...form, price: e.target.value })}
        style={inputStyle}
      />
      <input
        placeholder="Category"
        value={form.category}
        onChange={e => setForm({ ...form, category: e.target.value })}
        style={inputStyle}
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        style={{ ...inputStyle, height: '100px' }}
      />
      <input type="file" onChange={e => setImage(e.target.files[0])} style={{ marginBottom: '10px' }} />
      <button onClick={upload} style={uploadBtnStyle}>📤 Upload</button>
    </div>
  );
};

// ✅ Simple styling
const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px'
};

const uploadBtnStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#0d6efd',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

export default ProductUpload;
