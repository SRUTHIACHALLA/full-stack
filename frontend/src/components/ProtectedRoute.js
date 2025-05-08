import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole, children }) => {
  const role = localStorage.getItem('role');

  if (!role) return <Navigate to="/login" />;
  if (role !== allowedRole && role !== 'admin') return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
