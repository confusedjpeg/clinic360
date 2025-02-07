import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("accessToken");
  const storedRole = localStorage.getItem("role"); // Set during login
  if (!token || storedRole !== role) {
    return role === "patient" ? <Navigate to="/login/patient" replace /> : <Navigate to="/login/doctor" replace />;
  }
  return children;
};

export default PrivateRoute;
