// src/components/doctor/PatientRecords.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientRecords = () => {
  const token = localStorage.getItem("accessToken");
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://localhost:8000/doctor-patient-records", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div>
      <h3>Patient Medical Records</h3>
      <ul>
        {records.map((rec) => (
          <li key={rec.id}>
            <strong>Patient ID:</strong> {rec.patient_id} <br />
            <strong>Record:</strong> {rec.record_details}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientRecords;
