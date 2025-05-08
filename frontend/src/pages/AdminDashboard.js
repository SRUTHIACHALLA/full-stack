import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [view, setView] = useState('summary');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [vendorPopupOpen, setVendorPopupOpen] = useState(false);
  const [editData, setEditData] = useState({});

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    const usersRes = await axios.get(`${API_BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const ordersRes = await axios.get(`${API_BASE_URL}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const productsRes = await axios.get(`${API_BASE_URL}/api/admin/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setUsers(usersRes.data);
    setOrders(ordersRes.data);
    setProducts(productsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openEditModal = (product) => {
    setEditData(product);
    setEditModalOpen(true);
  };

  const saveChanges = async () => {
    await axios.put(`${API_BASE_URL}/api/admin/product/${editData._id}`, editData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditModalOpen(false);
    fetchData();
  };

  const viewVendorProducts = async (vendorId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/vendor/${vendorId}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVendorProducts(res.data);
      setVendorPopupOpen(true);
    } catch (err) {
      console.error('❌ Failed to fetch vendor products:', err);
      alert('Could not fetch vendor products');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`${API_BASE_URL}/api/admin/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`${API_BASE_URL}/api/admin/product/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData();
  };

  const updateOrderStatus = async (id, newStatus) => {
    await axios.put(`${API_BASE_URL}/api/admin/order/${id}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchData();
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const vendorCount = users.filter(u => u.role === 'vendor').length;

  return (
    <div className="container" style={{ padding: '30px' }}>
      <h2 style={{ color: '#0d6efd', marginBottom: '2rem' }}>👑 Admin Dashboard</h2>

      {view === 'summary' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
          <div style={cardStyle} onClick={() => setView('orders')}>
            <img src="https://cdn-icons-png.flaticon.com/128/2838/2838912.png" alt="Orders" style={imgStyle} />
            <h3>Orders</h3>
            <p>{orders.length}</p>
            <p style={{ color: '#28a745' }}>Revenue: ₹{totalRevenue.toFixed(2)}</p>
          </div>
          <div style={cardStyle} onClick={() => setView('products')}>
            <img src="https://cdn-icons-png.flaticon.com/128/3342/3342137.png" alt="Products" style={imgStyle} />
            <h3>Products</h3>
            <p>{products.length}</p>
          </div>
          <div style={cardStyle} onClick={() => setView('users')}>
            <img src="https://cdn-icons-png.flaticon.com/128/1177/1177568.png" alt="Vendors" style={imgStyle} />
            <h3>Vendors</h3>
            <p>{vendorCount}</p>
          </div>
        </div>
      )}

      {view !== 'summary' && (
        <button onClick={() => setView('summary')} style={backBtnStyle}>🔙 Back to Summary</button>
      )}

      {view === 'users' && (
        <>
          <h3>👥 Vendors</h3>
          <div className="product-grid">
            {users.filter(u => u.role === 'vendor').map(v => (
              <div key={v._id} className="card">
                <p><b>{v.name}</b></p>
                <p>{v.email}</p>
                <p>📍 {v.location}</p>
                <button onClick={() => viewVendorProducts(v._id)}>🛒 View Products</button>
                <button className="delete-btn" onClick={() => deleteUser(v._id)}>🗑 Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'products' && (
        <>
          <h3>📦 Products</h3>
          <div className="product-grid">
            {products.map(p => (
              <div key={p._id} className="card">
                <p><b>{p.title}</b> (₹{p.price})</p>
                <p>Vendor: {p.vendorId?.name || 'Unknown'}</p>
                <button className="edit-btn" onClick={() => openEditModal(p)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => deleteProduct(p._id)}>🗑 Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {view === 'orders' && (
        <>
          <h3>🧾 Orders</h3>
          <div className="product-grid">
            {orders.map(o => (
              <div key={o._id} className="card">
                <p><b>Order #{o._id}</b></p>
                <p>Amount: ₹{o.totalAmount.toFixed(2)}</p>
                <p>From: {o.customerId?.name || 'Unknown'}</p>
                <p>To: {o.vendorId?.name || 'Unknown'}</p>
                <p>Status: <b>{o.status}</b></p>
                <p>Delivery: {new Date(o.deliveryDate).toLocaleDateString()}</p>
                {o.status === 'Placed' && (
                  <button onClick={() => updateOrderStatus(o._id, 'Shipped')}>📦 Mark as Shipped</button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

{editModalOpen && (
  <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
    <div className="popup-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4>Edit Product</h4>
        <button onClick={() => setEditModalOpen(false)} style={closeBtnStyle}>✖</button>
      </div>
      <input
        type="text"
        placeholder="Title"
        value={editData.title || ''}
        onChange={e => setEditData({ ...editData, title: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Price"
        value={editData.price || ''}
        onChange={e => setEditData({ ...editData, price: e.target.value })}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Category"
        value={editData.category || ''}
        onChange={e => setEditData({ ...editData, category: e.target.value })}
        style={inputStyle}
      />
      <textarea
        placeholder="Description"
        value={editData.description || ''}
        onChange={e => setEditData({ ...editData, description: e.target.value })}
        style={{ ...inputStyle, height: '100px' }}
      />
      <div style={{ marginTop: '15px' }}>
        <button onClick={saveChanges} style={saveBtnStyle}>💾 Save</button>
        <button onClick={() => setEditModalOpen(false)} style={cancelBtnStyle}>❌ Cancel</button>
      </div>
    </div>
  </div>
)}


      {vendorPopupOpen && (
        <div className="modal-overlay" onClick={() => setVendorPopupOpen(false)}>
          <div className="popup-slide-up" onClick={e => e.stopPropagation()}>
            <h4>Vendor Products</h4>
            <div className="product-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {vendorProducts.map(p => (
                <div key={p._id} className="card" style={{
                  width: '200px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: '#fff'
                }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9',
                      padding: '6px'
                    }}
                  />
                  <h5 style={{ margin: '10px 0 5px 0' }}>{p.title}</h5>
                  <p style={{ color: '#28a745' }}>₹{p.price}</p>
                </div>
                
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const cardStyle = {
  width: '220px',
  backgroundColor: '#fff',
  borderRadius: '16px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out'
};

const imgStyle = {
  width: '60px',
  height: '60px',
  marginBottom: '10px'
};

const backBtnStyle = {
  background: '#0d6efd',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '8px',
  marginBottom: '20px',
  cursor: 'pointer'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const saveBtnStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  marginRight: '10px',
  cursor: 'pointer'
};

const cancelBtnStyle = {
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const closeBtnStyle = {
  background: 'transparent',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#333'
};


export default AdminDashboard;
