import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/customer', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error('Error fetching orders:', err));
  }, []);

  return (
    <div className="container">
      <h2>📦 My Orders</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        orders.map(o => (
          <div key={o._id} className="order-card" style={{ background: '#fff', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 0 8px #ddd' }}>
            <p><strong>Date:</strong> {new Date(o.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {o.status}</p>
            <p><strong>Total:</strong> ₹{o.totalAmount.toFixed(2)}</p>
            <ul>
              {o.products.map((prod, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <img src={prod.productId?.image || 'https://via.placeholder.com/50'} alt="product" width="50" style={{ marginRight: '10px', borderRadius: '6px' }} />
                  <span>{prod.productId?.title || 'Product'} × {prod.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default CustomerOrders;
