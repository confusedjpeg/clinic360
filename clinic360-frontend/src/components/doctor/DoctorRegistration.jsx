import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const userData = { username, password };
      const response = await axios.post("http://localhost:8000/register/", userData, {
        headers: { "Content-Type": "application/json" }
      });
      alert("Registration successful! Please login.");
      navigate("/login/doctor");
    } catch (err) {
      setError("Registration failed: " + JSON.stringify(err.response.data.detail));
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Doctor Registration</h2>
      <form onSubmit={handleRegistration}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required />
        </div>
        {error && <p style={{color:"red"}}>{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login/doctor">Login here</Link></p>
    </div>
  );
};

export default DoctorRegistration;
