import React, { useState } from 'react';
import axios from 'axios';

const AddMedicalRecord = () => {
  const token = localStorage.getItem("accessToken");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("record_file", file);
      formData.append("description", description);
      await axios.post("http://localhost:8000/create-record/", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      setMessage("Medical record added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error uploading medical record.");
    }
  };

  return (
    <div>
      <h3>Add Medical Record</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} required />
        <textarea placeholder="Record Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="submit">Upload Record</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddMedicalRecord;
