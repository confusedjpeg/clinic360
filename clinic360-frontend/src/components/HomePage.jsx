import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Clinic360</h1>
      <div>
        <h2>Patient Portal</h2>
        <Link to="/login/patient">Patient Login</Link>
        <br />
        <Link to="/register/patient">Patient Registration</Link>
      </div>
      <div>
        <h2>Doctor Portal</h2>
        <Link to="/login/doctor">Doctor Login</Link>
        <br />
        <Link to="/register/doctor">Doctor Registration</Link>
      </div>
    </div>
  );
};

export default HomePage;
