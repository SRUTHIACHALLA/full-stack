import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('cart');
    navigate('/');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const homePath = role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : role === 'customer' ? '/customer' : '/';

  // ✅ Update cart count on page load, tab switch, or location change
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.length);
  };

  useEffect(() => {
    updateCartCount(); // initial load
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  // ✅ Also update on route/location change (e.g., after remove)
  useEffect(() => {
    updateCartCount();
  }, [location]);

  if (isAuthPage) {
    return (
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-brand">Shopiverse</Link>
        </div>
        <div className="navbar-right">
          <Link to="/">Home</Link>
        </div>
      </nav>
    );
  }

  if (!token) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={homePath} className="navbar-brand">Shopiverse</Link>
      </div>
      <div className="navbar-right">
        <Link to={homePath}>Home</Link>
        <Link to="/info">Info</Link>
        {role === 'customer' && (
            <Link to="/customer/orders">Orders</Link>
          )}
        {role === 'customer' && (
          <Link to="/cart">
            Cart {cartCount > 0 && (
              <span style={{
                backgroundColor: '#ffc107',
                color: '#000',
                borderRadius: '12px',
                padding: '2px 8px',
                marginLeft: '5px',
                fontWeight: 'bold',
                fontSize: '0.8rem'
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        )}
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
