import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('products');
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      const [productRes, orderRes] = await Promise.all([
        axios.get('/api/vendor/products', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/vendor/orders', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setProducts(productRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      console.error("❌ Failed to fetch vendor data:", err);
    }
  };

  const markAsShipped = async (id) => {
    await axios.put(`/api/vendor/order/${id}/status`, { status: 'Shipped' }, {
  headers: { Authorization: `Bearer ${token}` }
});
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statusBadge = (status) => {
    const color = {
      Placed: '#ffc107',
      Shipped: '#17a2b8',
      Delivered: '#28a745',
      Cancelled: '#dc3545'
    }[status] || '#6c757d';
    return <span style={{ backgroundColor: color, color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>{status}</span>;
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      <h2 style={{ color: '#0d6efd', marginBottom: '1.5rem' }}>🔒 Vendor Dashboard</h2>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setView('products')} style={navButtonStyle}>📦 My Products</button>
        <button onClick={() => setView('orders')} style={navButtonStyle}>🧾 Orders Received</button>
      </div>

      <a href="/upload" style={uploadButtonStyle}>Upload New Product</a>

      {/* Products View */}
      {view === 'products' && (
        <div className="product-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {products.map(p => (
            <div key={p._id} className="product-card" style={productCardStyle}>
              <img src={p.image} alt={p.title} style={imgStyle} />
              <h4 style={{ marginTop: '10px' }}>{p.title}</h4>
              <p style={{ color: '#28a745' }}>₹{p.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Orders View */}
      {view === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <p>No orders received yet.</p>
          ) : (
            <div className="order-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
  {orders.map(order => (
    <div key={order._id} className="order-card" style={{
      flex: '1 1 300px',
      padding: '15px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#fff',
      minWidth: '280px'
    }}>
      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {statusBadge(order.status)}</p>
      <p><strong>Customer:</strong> {order.customerId?.name || 'N/A'}</p>
      <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
      <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>

      <div style={{ marginTop: '10px' }}>
        {order.products.map((prod, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            background: '#f9f9f9',
            padding: '6px',
            borderRadius: '6px'
          }}>
            <img
              src={prod.productId?.image || 'https://via.placeholder.com/50'}
              alt={prod.productId?.title || prod.title || 'Product'}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '6px',
                marginRight: '10px'
              }}
            />
            <span>{prod.productId?.title || prod.title || 'Product'} × {prod.quantity}</span>
          </div>
        ))}
      </div>

      {order.status === 'Placed' && (
        <button
          onClick={() => markAsShipped(order._id)}
          style={{
            marginTop: '10px',
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          📦 Mark as Shipped
        </button>
      )}
    </div>
  ))}
</div>

          )}
        </div>
      )}
    </div>
  );
};

// Styles
const navButtonStyle = {
  padding: '10px 20px',
  background: 'linear-gradient(to right, #7b2ff7, #1e90ff)',
  border: 'none',
  borderRadius: '25px',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const uploadButtonStyle = {
  display: 'inline-block',
  backgroundColor: '#28a745',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold',
  marginBottom: '2rem'
};

const productCardStyle = {
  width: '200px',
  padding: '10px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fff',
  textAlign: 'center'
};

const imgStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '4px'
};

const orderCardStyle = {
  marginBottom: '20px',
  padding: '15px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  backgroundColor: '#fff'
};

export default VendorDashboard;
