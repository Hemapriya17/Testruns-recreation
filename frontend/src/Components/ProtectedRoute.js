// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './Spinner'; // Import the custom spinner

const ProtectedRoute = ({ element }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner />
      </div>
    ); // Show custom spinner while loading
  }

  return currentUser ? element : <Navigate to="/" state={{ from: location }} />;
};

export default ProtectedRoute;
