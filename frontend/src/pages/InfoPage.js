import React from 'react';

const InfoPage = () => (
  <div
    className="container"
    style={{
      maxWidth: '900px',
      margin: 'auto',
      padding: '50px 20px',
      background: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      fontFamily: 'Segoe UI, sans-serif',
    }}
  >
    <h2 style={{ color: '#0d6efd', marginBottom: '1rem', textAlign: 'center' }}>🌐 Welcome to Shopiverse</h2>
    
    <p style={{ fontSize: '1.1rem', color: '#333', textAlign: 'center', lineHeight: '1.8' }}>
      <b>Shopiverse</b> is your all-in-one multi-vendor marketplace—developed with the powerful <b>MERN stack</b> (MongoDB, Express, React, Node.js)—that enables secure, scalable, and intelligent e-commerce experiences.
    </p>

    <div style={{ marginTop: '30px' }}>
      <h3 style={{ color: '#222', marginBottom: '1rem' }}>🛠️ Key Features</h3>
      <ul style={{ fontSize: '1rem', color: '#444', lineHeight: '1.8', paddingLeft: '1.2rem' }}>
        <li>🔑 Role-based authentication for <b>Customers, Vendors, and Admins</b></li>
        <li>🤖 Smart <b>AI-powered product recommendations</b> for customers</li>
        <li>💳 Seamless checkout with <b>Razorpay payment integration</b></li>
        <li>📦 Real-time <b>order tracking</b> with delivery status updates</li>
        <li>🛍️ Vendors can <b>upload and manage products</b> with ease</li>
        <li>📊 Admin dashboard for user, product, and order analytics</li>
      </ul>
    </div>

    <div style={{ marginTop: '40px', textAlign: 'center' }}>
      <p style={{ fontSize: '1rem', color: '#555' }}>
        For help, feedback, or suggestions, reach out to us at:<br />
        <a href="mailto:support@shopiverse.com" style={{ color: '#0d6efd', textDecoration: 'none' }}>
          📧 support@shopiverse.com
        </a>
      </p>
    </div>
  </div>
);

export default InfoPage;
