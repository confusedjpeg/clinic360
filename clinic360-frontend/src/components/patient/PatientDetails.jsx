import React, { useState } from 'react';
import axios from 'axios';

const PatientDetails = () => {
  const token = localStorage.getItem("accessToken");
  const [details, setDetails] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    medical_history: ""
  });
  const [message, setMessage] = useState("");
  
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/register-patient/", details, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Patient details registered successfully!");
      // Optionally store patient ID: localStorage.setItem("patientId", response.data.id);
    } catch (err) {
      console.error(err);
      setMessage("Error registering patient details.");
    }
  };
  
  return (
    <div>
      <h3>Register Your Details</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={details.name} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={details.age} onChange={handleChange} required />
        <input type="text" name="gender" placeholder="Gender" value={details.gender} onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Contact" value={details.contact} onChange={handleChange} required />
        <textarea name="medical_history" placeholder="Medical History" value={details.medical_history} onChange={handleChange} required />
        <button type="submit">Submit Details</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PatientDetails;
