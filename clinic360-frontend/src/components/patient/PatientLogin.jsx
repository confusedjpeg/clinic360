import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PatientLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      
      const response = await axios.post("http://localhost:8000/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("role", "patient");
      // Optionally, store patientId if provided by the backend
      navigate("/dashboard/patient");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Patient Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color:"red"}}>{error}</p>}
      <p>Don't have an account? <Link to="/register/patient">Register here</Link></p>
    </div>
  );
};

export default PatientLogin;
