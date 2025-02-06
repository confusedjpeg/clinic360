// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage'; // Import the new component
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route 
          path="/patient" 
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/doctor" 
          element={
            <PrivateRoute>
              <DoctorDashboard />
            </Pri