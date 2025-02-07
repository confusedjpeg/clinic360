import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookAppointment = () => {
  const token = localStorage.getItem("accessToken");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/doctors", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, [token]);

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        doctor_id: selectedDoctor,
        appointment_time: appointmentTime
      };
      await axios.post("http://localhost:8000/book-appointment/", appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Appointment booked successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error booking appointment.");
    }
  };

  return (
    <div>
      <h3>Book an Appointment</h3>
      <form onSubmit={handleBooking}>
        <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
          <option value="">Select a Doctor</option>
          {doctors.map(doc => (
            <option key={doc.id} value={doc.id}>{doc.name} - {doc.speciality}</option>
          ))}
        </select>
        <input type="datetime-local" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required />
        <button type="submit">Book Appointment</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BookAppointment;
