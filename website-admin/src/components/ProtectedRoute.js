import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
    // If the user is not logged in then they cannot access the site via url
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
