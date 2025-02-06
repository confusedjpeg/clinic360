import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [records, setRecords] = useState([]);
  const token = localStorage.getItem("accessToken");
  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    if (patientId) {
      axios.get(`http://localhost:8000/view-records/${patientId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setRecords(response.data);
      })
      .catch((err) => {
        console.error("Error fetching records:", err);
      });
    }
  }, [patientId, token]);

  const handleBookAppointment = async () => {
    try {
      // Replace "doctor-uuid-placeholder" with a valid doctor UUID from your system.
      const appointmentData = {
        doctor_id: "doctor-uuid-placeholder",
        appointment_time: new Date().toISOString()
      };

      const response = await axios.post("http://localhost:8000/book-appointment/", appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Appointment booked successfully!");
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Error booking appointment.");
    }
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <button onClick={handleBookAppointment}>Book Appointment</button>
      <h3>Medical Records</h3>
      <ul>
        {records && records.length > 0 ? (
          records.map(record => (
            <li key={record.id}>{record.record_details}</li>
          ))
        ) : (
          <li>No records found.</li>
        )}
      </ul>
    </div>
  );
};

export default PatientDashboard;
