import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      
      const response = await axios.post("http://localhost:8000/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      
      // Save token
      localStorage.setItem("accessToken", response.data.access_token);
      
      // (Optional) Save patient ID or role if available – here we demo a simple condition.
      if (username.toLowerCase().includes("doc")) {
        navigate("/doctor");
      } else {
        // For demonstration, store a dummy patient ID if needed for later calls.
        localStorage.setItem("patientId", "your-patient-uuid-here");
        navigate("/patient");
      }
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Username"
          value={username}
          onChange={(e)=> setUsername(e.target.value)}
          required
        />
        <br />
        <input 
          type="password" 
          placeholder="Password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>
  Don't have an account? <Link to="/register">Register here</Link>.
</p>
      {error && <p style={{color:"red"}}>{error}</p>}
    </div>
  );
};

export default LoginPage;
