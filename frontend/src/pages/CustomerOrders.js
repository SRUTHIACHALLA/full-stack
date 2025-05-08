import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/customer', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log("✅ Fetched Orders:", res.data);
      setOrders(res.data);
    })
    .catch(err => console.error('❌ Error fetching orders:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No orders yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {orders.map(o => (
            <div
              key={o._id}
              className="order-card"
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '16px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
            >
              <p><strong>Date:</strong> {new Date(o.date).toLocaleString()}</p>
              <p><strong>Status:</strong> {o.status}</p>
              <p><strong>Total:</strong> ₹{o.totalAmount}</p>

              <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                {o.products.map((prod, i) => {
                  const product = prod.productId || {};
                  const title = product.title || prod.title || 'Product';
                  const image = product.image || prod.image || 'https://via.placeholder.com/100';

                  return (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                      <img
                        src={image}
                        alt={title}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 8,
                          marginRight: 12
                        }}
                      />
                      <span style={{ fontSize: '14px' }}>{title} × {prod.quantity}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
