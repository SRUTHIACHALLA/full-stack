import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

  const userId = JSON.parse(localStorage.getItem('user') || '{}')._id;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/customer/products`);
        const formatted = res.data.map(p => ({
          ...p,
          _id: p._id?.toString(),
          vendorId: p.vendorId?._id || p.vendorId || null
        }));
        setProducts(formatted);
      } catch (err) {
        console.error('Failed to load products:', err);
        alert('Unable to fetch products.');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/recommendations/${userId}`);
        const data = await res.json();

        if (data?.message) {
          const fallbackRes = await fetch(`${API_BASE_URL}/api/trending-products`);
          const fallbackData = await fallbackRes.json();
          const fallbackProducts = products.filter(p => fallbackData.includes(p._id));
          setRecommendations(fallbackProducts);
        } else {
          const recommendedProducts = products.filter(p => data.includes(p._id));
          setRecommendations(recommendedProducts);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    if (products.length > 0) {
      fetchRecommendations();
    }
  }, [products, userId]);

  useEffect(() => {
    const handleStorageChange = () => {
      setCart(JSON.parse(localStorage.getItem('cart')) || []);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addToCart = async (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (currentCart.some(item => item._id === product._id)) {
      alert('Product already in cart');
      return;
    }

    const updatedCart = [...currentCart, {
      _id: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      vendorId: product.vendorId,
      quantity: 1
    }];

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    window.dispatchEvent(new Event("storage"));

    try {
      await fetch(`${API_BASE_URL}/api/log-interaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId: product._id, interaction: 1 })
      });
    } catch (err) {
      console.error("Failed to log interaction:", err);
    }

    alert('✅ Added to cart');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '2rem', alignItems: 'flex-start', padding: '1rem 2rem' }}>
      
      {/* 🔍 Recommendations Sidebar */}
      <div className="sidebar-recommendations">
        <h3>{recommendations.length > 0 ? '🔍 Recommended for You' : '🔥 Trending Products'}</h3>
        <p style={{ fontStyle: 'italic', color: '#888', marginTop: '-0.5rem' }}>
          {recommendations.length > 0 ? 'Based on your interests' : 'Here are popular picks!'}
        </p>

        <div className="trending-grid">
          {(recommendations.length === 0 && products.length > 0)
            ? products.slice(0, 5).map(p => (
              <div key={p._id} className="trending-item">
                <img src={p.image || 'https://via.placeholder.com/100'} alt={p.title} />
                <div className="trending-details">
                  <span className="title">{p.title}</span>
                  <span className="price">₹{p.price.toFixed(2)}</span>
                </div>
              </div>
            ))
            : recommendations.map(p => (
              <div key={p._id} className="trending-item">
                <img src={p.image || 'https://via.placeholder.com/100'} alt={p.title} />
                <div className="trending-details">
                  <span className="title">{p.title}</span>
                  <span className="price">₹{p.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 🛒 Product List */}
      <div className="container" style={{ flex: 1 }}>
        <h2 style={{ color: '#0d6efd', marginBottom: '1rem' }}>🛒 Customer Dashboard</h2>
        <h3>All Products</h3>
        <div className="product-grid">
          {products.map(p => (
            <div key={p._id} className="product-card">
              <img src={p.image || 'https://via.placeholder.com/200'} alt={p.title} />
              <h4>{p.title}</h4>
              <p style={{ color: '#28a745' }}>₹{p.price.toFixed(2)}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
