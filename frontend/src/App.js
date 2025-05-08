import React from 'react';
import './App.css';

import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import ProductUpload from './pages/ProductUpload';
import InfoPage from './pages/InfoPage';
import CartPage from './pages/CartPage';
import OrderPlaced from './pages/OrderPlaced';
import CustomerOrders from './pages/CustomerOrders';


const App = () => {
  const location = useLocation();
  const hideNavbar = ['/','/login','/signup'].includes(location.pathname);

  return (
    <div>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboards */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }/>

        <Route path="/vendor" element={
          <ProtectedRoute allowedRole="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        }/>

        <Route path="/customer" element={
          <ProtectedRoute allowedRole="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }/>
        
        <Route path="/orders" element={
          <ProtectedRoute allowedRole="customer">
            <CustomerOrders />
          </ProtectedRoute>
        } />

        <Route path="/upload" element={
          <ProtectedRoute allowedRole="vendor">
            <ProductUpload />
          </ProtectedRoute>
        }/>

        {/* Shared Routes */}
        <Route path="/order-placed" element={<OrderPlaced />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>

      {!hideNavbar}
    </div>
  );
};

export default App;
