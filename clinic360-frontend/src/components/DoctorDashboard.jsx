import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const token = localStorage.getItem("accessToken");
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    // Replace this with a valid endpoint to fetch doctor appointments.
    axios.get("http://localhost:8000/doctor-appointments", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      setAppointments(response.data);
    })
    .catch((err) => {
      console.error("Error fetching appointments:", err);
    });
  }, [token]);

  const handleUpdateRecord = async (recordId) => {
    try {
      const updateData = { record_details: "Updated details from doctor" };
      await axios.put(`http://localhost:8000/update-record/${recordId}/`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Record updated successfully!");
    } catch (err) {
      console.error("Error updating record:", err);
      alert("Error updating record.");
    }
  };

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <h3>Appointments</h3>
      <ul>
        {appointments && appointments.length > 0 ? (
          appointments.map(appt => (
            <li key={appt.id}>
              Appointment with patient {appt.patient_id} at {new Date(appt.appointment_time).toLocaleString()}
            </li>
          ))
        ) : (
          <li>No appointments found.</li>
        )}
      </ul>
      <h3>Patient Records Management</h3>
      {/* Demo button: in a real scenario, list records and allow editing */}
      <button onClick={() => handleUpdateRecord("record-uuid-placeholder")}>
        Update Record Example
      </button>
    </div>
  );
};

export default DoctorDashboard;
