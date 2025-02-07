import React, { useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const token = localStorage.getItem("accessToken");
  const [view, setView] = useState("home"); // Options: home, slots, appointments, records
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [error, setError] = useState("");

  const fetchAvailableSlots = async () => {
    try {
      const response = await axios.get("http://localhost:8000/doctor-availability", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableSlots(response.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  const fetchPatientRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8000/doctor-patient-records", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatientRecords(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addSlot = async () => {
    try {
      const slotData = {
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString() // 1 hour later
      };
      await axios.post("http://localhost:8000/add-availability", slotData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Slot added successfully!");
      fetchAvailableSlots();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePatientRecord = async (recordId) => {
    try {
      const updateData = { record_details: "Updated by doctor" };
      await axios.put(`http://localhost:8000/update-record/${recordId}/`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Record updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <nav>
        <button onClick={() => { setView("slots"); fetchAvailableSlots(); }}>Manage Slots</button>
        <button onClick={() => { setView("appointments"); fetchAppointments(); }}>Appointments</button>
        <button onClick={() => { setView("records"); fetchPatientRecords(); }}>Patient Records</button>
        <button onClick={() => setView("home")}>Home</button>
      </nav>

      {view === "home" && (
        <div>
          <h3>Welcome, Doctor!</h3>
          <p>Use the navigation buttons to manage your portal.</p>
        </div>
      )}

      {view === "slots" && (
        <div>
          <h3>Manage Available Slots</h3>
          <button onClick={addSlot}>Add New Slot</button>
          <ul>
            {availableSlots.map(slot => (
              <li key={slot.id}>
                {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === "appointments" && (
        <div>
          <h3>Scheduled Appointments</h3>
          <ul>
            {appointments.map(appt => (
              <li key={appt.id}>
                Appointment with Patient {appt.patient_id} at {new Date(appt.appointment_time).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}

      {view === "records" && (
        <div>
          <h3>Patient Medical Records</h3>
          <ul>
            {patientRecords.map(rec => (
              <li key={rec.id}>
                {rec.record_details}
                <button onClick={() => updatePatientRecord(rec.id)}>Update Record</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DoctorDashboard;
