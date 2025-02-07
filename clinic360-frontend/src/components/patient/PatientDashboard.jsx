import React, { useState } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const token = localStorage.getItem("accessToken");
  const [view, setView] = useState("home"); // Options: home, details, appointments, records
  const [personalDetails, setPersonalDetails] = useState({ username: "" });
  const [records, setRecords] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  const fetchPersonalDetails = async () => {
    try {
      // Replace with your actual endpoint
      const response = await axios.get("http://localhost:8000/patient-details", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPersonalDetails(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecords = async () => {
    try {
      // Assume you have stored patientId in localStorage or get it from details
      const patientId = localStorage.getItem("patientId");
      const response = await axios.get(`http://localhost:8000/view-records/${patientId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/patient-appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updatePersonalDetails = async () => {
    try {
      // Replace with your actual endpoint for updating details
      await axios.put("http://localhost:8000/update-patient-details", personalDetails, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Details updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const bookAppointment = async () => {
    try {
      // Replace "doctor-uuid-placeholder" with a valid doctor UUID
      const appointmentData = {
        doctor_id: "doctor-uuid-placeholder",
        appointment_time: new Date().toISOString()
      };
      await axios.post("http://localhost:8000/book-appointment/", appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Appointment booked successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <nav>
        <button onClick={() => { setView("details"); fetchPersonalDetails(); }}>Personal Details</button>
        <button onClick={() => { setView("appointments"); fetchAppointments(); }}>Appointments</button>
        <button onClick={() => { setView("records"); fetchRecords(); }}>Medical Records</button>
        <button onClick={() => setView("home")}>Home</button>
      </nav>

      {view === "home" && (
        <div>
          <h3>Welcome to your Dashboard!</h3>
          <button onClick={bookAppointment}>Book Appointment</button>
        </div>
      )}
      {view === "details" && (
        <div>
          <h3>Personal Details</h3>
          <input
            type="text"
            value={personalDetails.username}
            onChange={(e) => setPersonalDetails({ ...personalDetails, username: e.target.value })}
          />
          <button onClick={updatePersonalDetails}>Update Details</button>
        </div>
      )}
      {view === "appointments" && (
        <div>
          <h3>Your Appointments</h3>
          <ul>
            {appointments.map(appt => (
              <li key={appt.id}>Appointment at {new Date(appt.appointment_time).toLocaleString()}</li>
            ))}
          </ul>
          {/* Add functionality for reschedule/cancel as needed */}
        </div>
      )}
      {view === "records" && (
        <div>
          <h3>Medical Records</h3>
          <ul>
            {records.map(rec => (
              <li key={rec.id}>{rec.record_details}</li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PatientDashboard;
