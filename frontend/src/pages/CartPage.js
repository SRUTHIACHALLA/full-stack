import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config'; // ✅ import the base URL

const CartPage = () => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const updateQuantity = (id, amount) => {
    const updatedCart = cart.map(item =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please log in to proceed.");
        return;
      }

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) {
        alert("User not found. Please login again.");
        return;
      }

      const vendorId = cart[0]?.vendorId;
      if (!vendorId) {
        alert("Vendor information missing.");
        return;
      }

      const products = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      const { data } = await axios.post(`${API_BASE_URL}/api/payment/create-order`, { amount: total });

      const options = {
        key: 'rzp_test_4xpcHp4k9l7JPj',
        amount: data.amount,
        currency: 'INR',
        name: 'Shopiverse',
        description: 'Purchase Order',
        order_id: data.id,
        handler: async function (response) {
          alert("✅ Payment Successful!");

          try {
            await axios.post(
              `${API_BASE_URL}/api/orders/create`,
              {
                vendorId,
                products,
                totalAmount: total,
                location: {
                  city: 'SampleCity',
                  pincode: '123456'
                }
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            localStorage.removeItem('cart');
            setCart([]);
            navigate('/orders');
          } catch (orderErr) {
            console.error('❌ Order creation failed:', orderErr.response?.data || orderErr.message);
            alert('Failed to place order. Please try again.');
          }
        },
        prefill: {
          name: user.name || "Test User",
          email: user.email || "test@example.com"
        },
        theme: { color: "#1976d2" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        alert("Payment failed.");
      });

    } catch (err) {
      console.error("❌ Payment Error:", err.response?.data || err.message);
      alert("Server error during payment.");
    }
  };

  return (
    <div className="container">
      <h2 style={{ color: '#0d6efd', marginBottom: '1rem' }}>🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map(item => (
              <div key={item._id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.title}
                  style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4>{item.title}</h4>
                  <p>₹{item.price} × {item.quantity}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                    <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                    <button className="delete-btn" onClick={() => removeItem(item._id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <h3>Total: ₹{total.toFixed(2)}</h3>
            <button onClick={handlePayment}>Pay & Place Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
