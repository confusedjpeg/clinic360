import React, { useState } from 'react';
import PatientDetails from './PatientDetails';
import BookAppointment from './BookAppointment';
import ViewAppointments from './ViewAppointments';
import AddMedicalRecord from './AddMedicalRecord';

const PatientDashboard = () => {
  const [view, setView] = useState("home"); // Options: home, details, book, appointments, addRecord

  const renderView = () => {
    switch(view) {
      case "details": return <PatientDetails />;
      case "book": return <BookAppointment />;
      case "appointments": return <ViewAppointments />;
      case "addRecord": return <AddMedicalRecord />;
      default:
        return (
          <div>
            <h3>Welcome to your Patient Dashboard!</h3>
            <p>Select an option from the navigation.</p>
          </div>
        );
    }
  };

  return (
    <div>
      <h2>Patient Dashboard</h2>
      <nav>
        <button onClick={() => setView("details")}>Register Details</button>
        <button onClick={() => setView("book")}>Book Appointment</button>
        <button onClick={() => setView("appointments")}>View Appointments</button>
        <button onClick={() => setView("addRecord")}>Add Medical Record</button>
      </nav>
      {renderView()}
    </div>
  );
};

export default PatientDashboard;
