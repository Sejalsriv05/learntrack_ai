from datetime import timezone
import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="student", nullable=False)  # "faculty" or "student"
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(timezone.utc))
