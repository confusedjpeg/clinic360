import uuid
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.dialects.postgresql import UUID
import os
from pydantic import BaseModel, Field
from typing import Optional

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:kuhu2004@localhost:5432/clinic360") # Replace with your credentials

engine = create_engine(DATABASE_URL)
Base = declarative_base()

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


Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)