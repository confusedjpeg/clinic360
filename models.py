import uuid
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.dialects.postgresql import UUID
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://user:password@localhost:5432/clinic360") # Replace with your credentials

engine = create_engine(DATABASE_URL)
Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)
    contact = Column(String)
    medical_history = Column(Text) #Simplified for now

    records = relationship("MedicalRecord", backref="patient")

class MedicalRecord(Base):
    __tablename__ = "medical_records"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id"), nullable=False)
    record_details = Column(Text, nullable=False) #Keep simple for now


Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)