```markdown
# Arogo AI – Python Developer Intern Assignment: Clinic360 Platform

[![Video Demo](https://img.youtube.com/vi/tVD2goWGLb8/0.jpg)](https://www.youtube.com/watch?v=tVD2goWGLb8)

## Overview
The Clinic360 platform is a scalable and efficient web application designed to manage electronic health records (EHR), appointment scheduling, and user interactions for both patients and doctors. This project evaluates backend development, API creation, database management, asynchronous processing, UI development, and deployment skills using Python, FastAPI, and React.

## Objectives
- **API Development (EHR System):**  
  Implement a RESTful API to manage patient records and medical records with secure JWT authentication.
- **Appointment Booking System:**  
  Enable patients to book, reschedule, or cancel appointments and provide doctors with tools to manage available time slots.
- **UI Development:**  
  Build responsive patient and doctor portals for interacting with the system.
- **Deployment & Documentation:**  
  Deploy the application using containerization and host it on platforms such as Render/AWS (backend) and Vercel/Netlify (frontend). Provide clear documentation and a demonstration video.

## Features

### 1. API Development – Electronic Health Records (EHR) System
- **Endpoints:**
  - `POST /register-patient/` – Register a new patient with details (name, age, gender, contact, and medical history).
  - `POST /create-record/` – Create a new medical record linked to a patient.
  - `GET /view-records/{patient_id}/` – Retrieve records for a specific patient.
  - `PUT /update-record/{record_id}/` – Update an existing record.
  - `DELETE /delete-record/{record_id}/` – Delete a medical record.
- **Security:**  
  JWT authentication is implemented to secure endpoints.
- **Database:**  
  Data is stored in PostgreSQL using SQLAlchemy.

### 2. Appointment Booking System
- **Features:**
  - **Doctor Availability Management:**  
    Doctors can set their available time slots.
  - **Appointment Booking:**  
    Patients can book appointments based on available slots.
  - **Rescheduling & Cancellation:**  
    Patients can modify or cancel appointments.
  - **Notifications:**  
    Email notifications are sent using Celery and Redis as background tasks.

### 3. User Interface (UI) Development
- **Patient Portal:**
  - Register/Login.
  - View and update personal details.
  - Book, reschedule, or cancel appointments.
  - View medical records (EHR).
- **Doctor Portal:**
  - Register/Login.
  - Manage available appointment slots.
  - View scheduled appointments.
  - Access and update patient medical records.

## Technologies Used
- **Backend:** Python, FastAPI, SQLAlchemy, PostgreSQL, JWT, Celery, Redis.
- **Frontend:** React.js, Axios, React Router.
- **Deployment:** Docker, Vercel/Netlify, Render/AWS Lambda.

## Project Structure
```
Clinic360/
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── notif.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   └── components/
    │       ├── HomePage.jsx
    │       ├── PrivateRoute.jsx
    │       ├── patient/
    │       │   ├── PatientLogin.jsx
    │       │   ├── PatientRegistration.jsx
    │       │   ├── PatientDashboard.jsx
    │       │   ├── PatientDetails.jsx
    │       │   ├── BookAppointment.jsx
    │       │   ├── ViewAppointments.jsx
    │       │   └── AddMedicalRecord.jsx
    │       └── doctor/
    │           ├── DoctorLogin.jsx
    │           ├── DoctorRegistration.jsx
    │           ├── DoctorDashboard.jsx
    │           ├── ManageSlots.jsx
    │           ├── ViewAppointments.jsx
    │           └── PatientRecords.jsx
```

## Setup & Installation

### Backend Setup
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Clinic360/backend
   ```

2. **Create a virtual environment and install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate        # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**  
   Create a `.env` file with the following (adjust values accordingly):
   ```
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/clinic360
   SECRET_KEY=your_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASSWORD=your_email_password
   ```

4. **Run the backend server:**
   ```bash
   uvicorn main:app --reload
   ```
   Access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### Frontend Setup
1. **Navigate to the frontend folder:**
   ```bash
   cd Clinic360/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the frontend application:**
   ```bash
   npm start
   ```
   The application will run on [http://localhost:3000](http://localhost:3000).

## API Usage Guide

### Patient Endpoints
- **Register Patient:**  
  `POST /register-patient/`  
  **Request:**
  ```json
  {
    "name": "John Doe",
    "age": 30,
    "gender": "male",
    "contact": "1234567890",
    "medical_history": "Diabetes, Hypertension"
  }
  ```
  **Response:**
  ```json
  {
    "id": "generated-uuid",
    "name": "John Doe",
    "age": 30,
    "gender": "male",
    "contact": "1234567890",
    "medical_history": "Diabetes, Hypertension"
  }
  ```

- **Create Medical Record:**  
  `POST /create-record/`  
  **Request:**
  ```json
  {
    "patient_id": "patient-uuid",
    "record_details": "Record details or file attachment info"
  }
  ```

- **View Medical Records:**  
  `GET /view-records/{patient_id}/`

- **Update Medical Record:**  
  `PUT /update-record/{record_id}/`  
  **Request:**
  ```json
  {
    "record_details": "Updated details"
  }
  ```

- **Delete Medical Record:**  
  `DELETE /delete-record/{record_id}/`

### Appointment Booking Endpoints
- **Book Appointment:**  
  `POST /book-appointment/`  
  **Request:**
  ```json
  {
    "doctor_id": "doctor-uuid",
    "appointment_time": "2025-02-08T10:00:00"
  }
  ```

- **Reschedule Appointment:**  
  `PUT /reschedule-appointment/{appointment_id}/`
- **Cancel Appointment:**  
  `DELETE /cancel-appointment/{appointment_id}/`

### Doctor Endpoints
- **Add Availability Slot:**  
  `POST /add-availability/`  
  **Request:**
  ```json
  {
    "start_time": "2025-02-08T10:00:00",
    "end_time": "2025-02-08T11:00:00"
  }
  ```

- **Fetch Doctor Appointments:**  
  `GET /doctor-appointments/`
- **Fetch Patient Records (for doctor review):**  
  `GET /doctor-patient-records/`

*Note: All protected endpoints require a valid JWT token in the `Authorization` header as `Bearer <token>`.*

## Deployment

### Docker Containerization
- **Backend Dockerfile Example:**
  ```Dockerfile
  FROM python:3.9
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install -r requirements.txt
  COPY . .
  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
  ```
- **Frontend Dockerfile Example:**
  ```Dockerfile
  FROM node:14
  WORKDIR /app
  COPY package.json .
  RUN npm install
  COPY . .
  RUN npm run build
  CMD ["npx", "serve", "-s", "build"]
  ```
- **Docker Compose:**  
  Use a `docker-compose.yml` file to orchestrate multi-container deployment if required.

### Hosting
- **Backend:**  
  Deploy on Render, AWS Lambda, or a similar platform.
- **Frontend:**  
  Deploy on Vercel, Netlify, or any similar hosting service.

## Documentation & Demonstration
- **README:**  
  This file provides comprehensive setup instructions, API usage, and deployment details.
- **Video Demonstration:**  
  A 5-10 minute video demonstration explaining the project’s architecture, API functionality, UI features, and deployment process. *(Include the hosted demo links and video link in your submission.)*

## Additional Notes
- **CORS Configuration:**  
  Ensure CORS is enabled in FastAPI to allow requests from the frontend domain.
- **JWT Authentication:**  
  Secure endpoints are protected using JWT tokens; refer to the `/token` endpoint for authentication.
- **Background Tasks:**  
  Email notifications for appointments are handled using Celery and Redis.

## Conclusion
This project demonstrates a full-stack application that integrates API development, database management, asynchronous processing, and UI development. The Clinic360 platform is designed to streamline the management of health records and appointments, providing a robust solution for patients and doctors alike.

---

*Good luck, and thank you for reviewing the Clinic360 project!*
```
