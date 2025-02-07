import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientLogin from './components/patient/PatientLogin';
import PatientRegistration from './components/patient/PatientRegistration';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorLogin from './components/doctor/DoctorLogin';
import DoctorRegistration from './components/doctor/DoctorRegistration';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Patient Routes */}
        <Route path="/login/patient" element={<PatientLogin />} />
        <Route path="/register/patient" element={<PatientRegistration />} />
        <Route
          path="/dashboard/patient"
          element={
            <PrivateRoute role="patient">
              <PatientDashboard />
            </PrivateRoute>
          }
        />

        {/* Doctor Routes */}
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/register/doctor" element={<DoctorRegistration />} />
        <Route
          path="/dashboard/doctor"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login/patient" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
