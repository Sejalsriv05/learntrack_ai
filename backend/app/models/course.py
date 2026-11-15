from datetime import timezone
import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, index=True, nullable=False)       # e.g. "CS3104"
    name = Column(String, nullable=False)                    # e.g. "Machine Learning"
    section = Column(String, default="section A")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(timezone.utc))

    units = relationship("CourseUnit", back_populates="course", cascade="all, delete-orphan")


class CourseUnit(Base):
    __tablename__ = "course_units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    unit_number = Column(Integer, nullable=False)            # e.g. 3
    title = Column(String, nullable=False)                   # e.g. "Unit 3: Regularization"
    total_pages = Column(Integer, default=25, nullable=False)
    assigned_date = Column(String, default="12 Sep")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(timezone.utc))

    course = relationship("Course", back_populates="units")
    pages = relationship("UnitPage", back_populates="unit", cascade="all, delete-orphan")


class UnitPage(Base):
    __tablename__ = "unit_pages"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("course_units.id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    key_concept = Column(String, nullable=True)
    estimated_reading_sec = Column(Integer, default=60)

    unit = relationship("CourseUnit", back_populates="pages")
