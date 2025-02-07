// src/components/doctor/ManageSlots.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageSlots = () => {
  const token = localStorage.getItem("accessToken");
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const fetchSlots = async () => {
    try {
      const response = await axios.get("http://localhost:8000/doctor-availability", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlots(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const slotData = {
        start_time: startTime,
        end_time: endTime
      };
      await axios.post("http://localhost:8000/add-availability", slotData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Slot added successfully!");
      setStartTime("");
      setEndTime("");
      fetchSlots();
    } catch (err) {
      console.error(err);
      setMessage("Error adding slot.");
    }
  };

  return (
    <div>
      <h3>Manage Available Slots</h3>
      <form onSubmit={handleAddSlot}>
        <div>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Slot</button>
      </form>
      {message && <p>{message}</p>}
      <h4>Existing Slots</h4>
      <ul>
        {slots.map((slot) => (
          <li key={slot.id}>
            {new Date(slot.start_time).toLocaleString()} - {new Date(slot.end_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageSlots;
