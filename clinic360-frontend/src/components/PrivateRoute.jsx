import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("accessToken");
  const storedRole = localStorage.getItem("role"); // Set on login
  if (!token || storedRole !== role) {
    // Redirect to the appropriate login page based on role
    return role === "patient" ? <Navigate to="/login/patient" replace /> : <Navigate to="/login/doctor" replace />;
  }
  return children;
};

export default PrivateRoute;
