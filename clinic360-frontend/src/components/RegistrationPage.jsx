// src/components/RegistrationPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userData = { username, password };
      const response = await axios.post("http://localhost:8000/register/", userData, {
        headers: { "Content-Type": "application/json" }
      });
      if (response.data) {
        // Optionally display a success message, then redirect to login
        alert("Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try a different username.");
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleRegistration}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e)=> setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e)=> setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e)=> setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{color:"red"}}>{error}</p>}
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default RegistrationPage;
