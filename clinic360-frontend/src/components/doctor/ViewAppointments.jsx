// src/components/doctor/ViewAppointments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAppointments = () => {
  const token = localStorage.getItem("accessToken");
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/doctor-appointments", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div>
      <h3>Scheduled Appointments</h3>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id}>
            Appointment with Patient {appt.patient_id} on {new Date(appt.appointment_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppointments;
