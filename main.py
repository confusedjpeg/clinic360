import uvicorn
import uuid
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import User, Patient, MedicalRecord, Appointment, Doctor, SessionLocal
import jwt
import os
from datetime import datetime, timedelta
from pydantic import BaseModel, Field #for input validation
from typing import Optional
import bcrypt  
from datetime import datetime
from celery.schedules import crontab
from celery.result import AsyncResult
from notif import send_email


SECRET_KEY = os.environ.get("SECRET_KEY", "default_key_for_development_only") #Set your own SECRET_KEY in .env file or os environment variable
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # List your frontend's URL(s) here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#JWT Functions -  Very Basic for now (Replace with more robust implementation in a real-world app)        
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
   try:
       payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
       #In a real application, you would fetch user from database based on payload['user_id']
       return payload # Placeholder for now
   except jwt.ExpiredSignatureError:
       raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
   except jwt.InvalidTokenError:
       raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


#Pydantic Models for input validation

class UserPydantic(BaseModel):
    id: uuid.UUID
    username: str
    #password_hash: str #Don't include password hash in response

    class Config:
        orm_mode = True  # Enable mapping from SQLAlchemy models

class PatientCreate(BaseModel):  # For creating patients
    name: str = Field(..., min_length=1, max_length=255)
    age: int = Field(..., ge=0)
    gender: str = Field(..., min_length=1, max_length=10)
    contact: str = Field(..., min_length=1)
    medical_history: str = Field(...)

class PatientBase(BaseModel): #Common fields
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    contact: Optional[str] = None
    medical_history: Optional[str] = None

class Patient(PatientBase): #Adding the UUID
    id: uuid.UUID
    class Config:
         orm_mode = True #this is important to use SQLAlchemy models


class MedicalRecordCreate(BaseModel):
    patient_id: uuid.UUID = Field(...)
    record_details: str = Field(..., min_length=1)

class MedicalRecord(BaseModel):
    id: uuid.UUID
    patient_id: uuid.UUID
    record_details: str

    class Config:
        orm_mode = True

class RecordUpdate(BaseModel):
    record_details: str | None = Field(default=None, min_length=1) 

class AppointmentCreate(BaseModel):
    doctor_id: uuid.UUID = Field(...)
    appointment_time: datetime = Field(...) #Requires specific format

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

#User Credentials Model for input validation
class UserCredentials(BaseModel):
    username: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=8)


@app.post("/token") #Enhanced Token endpoint
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not user.check_password(form_data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    token = create_access_token({"user_id": str(user.id)}) # Use str(user.id)
    return {"access_token": token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == uuid.UUID(user_id)).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")
    
@app.post("/register/", response_model=UserPydantic)
def register_user(user: UserCredentials, db: Session = Depends(get_db)):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    new_user = User(username=user.username, password_hash=hashed_password.decode('utf-8'))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/register-patient/", response_model=Patient)
def register_patient(patient: PatientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        new_patient = Patient(**patient.dict())
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)
        return new_patient
    except Exception as e:
        print(f"Error registering patient: {e}") #Log the error
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/create-record/", response_model=MedicalRecord)
def create_record(record: MedicalRecordCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        existing_patient = db.query(Patient).filter(Patient.id == record.patient_id).first()
        if not existing_patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        new_record = MedicalRecord(patient_id=record.patient_id, record_details=record.record_details)
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record
    except HTTPException as e: #Handle existing exceptions
        raise e
    except Exception as e: #Handle other exceptions
        print(f"Error creating record: {e}") #Log the error
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/view-records/{patient_id}/", response_model=list[MedicalRecord])
def view_records(patient_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).all()
    return records

@app.put("/update-record/{record_id}/", response_model=MedicalRecord)
def update_record(record_id: uuid.UUID, record_update: RecordUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")

        if record_update.record_details:
            record.record_details = record_update.record_details  # Update only if a new detail is provided

        db.commit()
        db.refresh(record)
        return record
    except HTTPException as e:
      raise e
    except Exception as e:
        print(f"Error updating record: {e}") #Log the error
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.delete("/delete-record/{record_id}/", status_code=status.HTTP_204_NO_CONTENT)
def delete_record(record_id: uuid.UUID, db: Session = Depends(get_db)):
    try:
        record = db.query(MedicalRecord).filter(MedicalRecord.id == record_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Record not found")
        db.delete(record)
        db.commit()
        return None # 204 No Content
    except HTTPException as e:
      raise e
    except Exception as e:
        print(f"Error deleting record: {e}") #Log the error
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/book-appointment/")
async def book_appointment(appointment_data: AppointmentCreate, db: Session = Depends(get_db), current_user:User = Depends(get_current_user)):
    #Simple availability check (replace with more sophisticated logic later)
    doctor = db.query(Doctor).filter(Doctor.id == appointment_data.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    #Concurrency Handling (using database transaction)
    try:
        db.begin() #Start transaction
        new_appointment = Appointment(doctor_id=appointment_data.doctor_id, patient_id=current_user.id, appointment_time=appointment_data.appointment_time)
        db.add(new_appointment)
        db.commit() #Commit transaction only if successful
        db.refresh(new_appointment)
        email_data = {
            "recipient": current_user.email, #You'll need to add email field to your User model.
            "subject": "Appointment Confirmation",
            "body": f"Your appointment with Dr. {doctor.name} is scheduled for {new_appointment.appointment_time}",
        }
        send_email.delay(email_data)
    except Exception as e:
        db.rollback() #Rollback transaction if error occurs
        print(f"Error booking appointment: {e}") #Log the error
        raise HTTPException(status_code=500, detail="Error booking appointment. Please try again later.")

    return new_appointment

@app.put("/reschedule-appointment/{appointment_id}/")
async def reschedule_appointment(appointment_id: uuid.UUID, new_appointment_time: datetime, db: Session = Depends(get_db), current_user:User = Depends(get_current_user)):
  appointment = db.query(Appointment).filter(Appointment.id == appointment_id, Appointment.patient_id == current_user.id, Appointment.booked == True).first()
  if not appointment:
    raise HTTPException(status_code=404, detail="Appointment not found or already cancelled")

  #Check if the new time is valid (e.g., not in the past)
  if new_appointment_time < datetime.now():
    raise HTTPException(status_code=400, detail="Cannot schedule appointment in the past")

  appointment.appointment_time = new_appointment_time
  db.commit()
  return appointment

@app.delete("/cancel-appointment/{appointment_id}/")
async def cancel_appointment(appointment_id: uuid.UUID, db: Session = Depends(get_db), current_user:User = Depends(get_current_user)):
  appointment = db.query(Appointment).filter(Appointment.id == appointment_id, Appointment.patient_id == current_user.id, Appointment.booked == True).first()
  if not appointment:
    raise HTTPException(status_code=404, detail="Appointment not found or already cancelled")

  appointment.booked = False #Instead of deleting, we set the booked status to False
  db.commit()
  return {"message": "Appointment cancelled successfully"}

@app.post("/send-test-email/")
async def send_test_email():
    email_data = {
        "recipient": "parkjimin4471@gmail.com",  # Replace with your test email address
        "subject": "Test Email from Celery",
        "body": "This is a test email sent using Celery and yagmail.",
    }
    task = send_email.delay(email_data)
    return {"task_id": task.id}



@app.get("/tasks/{task_id}/")
async def check_task_status(task_id: str):
  task = AsyncResult(task_id)
  return {"status": task.status, "result":task.result}