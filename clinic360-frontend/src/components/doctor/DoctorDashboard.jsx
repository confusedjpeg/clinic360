// src/components/doctor/DoctorDashboard.jsx
import React, { useState } from 'react';
import ManageSlots from './ManageSlots';
import ViewAppointments from './ViewAppointments';
import PatientRecords from './PatientRecords';

const DoctorDashboard = () => {
  const [view, setView] = useState("home"); // Options: home, slots, appointments, records

  const renderView = () => {
    switch (view) {
      case "slots":
        return <ManageSlots />;
      case "appointments":
        return <ViewAppointments />;
      case "records":
        return <PatientRecords />;
      default:
        return (
          <div>
            <h3>Welcome, Doctor!</h3>
            <p>Please select an option from the navigation below.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <nav>
        <button onClick={() => setView("slots")}>Manage Slots</button>
        <button onClick={() => setView("appointments")}>View Appointments</button>
        <button onClick={() => setView("records")}>Patient Records</button>
        <button onClick={() => setView("home")}>Home</button>
      </nav>
      {renderView()}
    </div>
  );
};

export default DoctorDashboard;
