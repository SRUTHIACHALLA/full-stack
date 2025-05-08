import React, { useState } from 'react';
import axios from 'axios';

const ProductUpload = () => {
  const [form, setForm] = useState({ title: '', price: '', category: '', description: '' });
  const [image, setImage] = useState(null);

  const upload = async () => {
    const token = localStorage.getItem('token');
    const data = new FormData();

    for (let key in form) data.append(key, form[key]);
    data.append('image', image);

    await axios.post('/api/vendor/upload', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Product uploaded');
  };

  return (
    <div>
      <h2>Upload Product</h2>
      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Price" onChange={e => setForm({ ...form, price: e.target.value })} />
      <input placeholder="Category" onChange={e => setForm({ ...form, category: e.target.value })} />
      <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
    </div>
  );
};

export default ProductUpload;
