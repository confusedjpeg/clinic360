import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAppointments = () => {
  const token = localStorage.getItem("accessToken");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
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
    fetchAppointments();
  }, [token]);

  return (
    <div>
      <h3>Your Appointments</h3>
      <ul>
        {appointments.map(appt => (
          <li key={appt.id}>With Doctor {appt.doctor_id} on {new Date(appt.appointment_time).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default ViewAppointments;
