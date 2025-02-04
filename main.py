import uvicorn
import uuid
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from models import Patient, MedicalRecord, SessionLocal 
import jwt
import os
from datetime import datetime, timedelta
from pydantic import BaseModel, Field #for input validation


SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key") #Set your own SECRET_KEY in .env file or os environment variable
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI()

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

class PatientCreate(BaseModel):
   name: str = Field(..., min_length=1, max_length=255)
   age: int = Field(..., ge=0)
   gender: str = Field(..., min_length=1, max_length=10)
   contact: str = Field(..., min_length=1)
   medical_history: str = Field(...)

class RecordCreate(BaseModel):
    patient_id: uuid.UUID = Field(...) #Requires the UUID of existing patient
    record_details: str = Field(..., min_length=1)



@app.post("/register-patient/", response_model=Patient)
def register_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    new_patient = Patient(**patient.dict())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@app.post("/create-record/", response_model=MedicalRecord)
def create_record(record: RecordCreate, db: Session = Depends(get_db)):
    existing_patient = db.query(Patient).filter(Patient.id == record.patient_id).first()
    if not existing_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    new_record = MedicalRecord(patient_id=record.patient_id, record_details=record.record_details)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

@app.get("/view-records/{patient_id}/", response_model=list[MedicalRecord])
def view_records(patient_id: uuid.UUID, db: Session = Depends(get_db)):
    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient_id).all()
    return records


@app.post("/token") #Simple Token endpoint
def login(db: Session = Depends(get_db)):
    #In real application, you would validate user credentials here.
    #For this example, we just return a token
    token = create_access_token({"user_id": "testuser"}) #Replace with actual user ID later
    return {"access_token": token, "token_type": "bearer"}