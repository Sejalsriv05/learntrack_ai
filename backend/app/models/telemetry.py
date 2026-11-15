from datetime import timezone
import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

class ReadingSession(Base):
    __tablename__ = "reading_sessions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("course_units.id"), nullable=False)
    started_at = Column(DateTime, default=lambda: datetime.datetime.now(timezone.utc))
    ended_at = Column(DateTime, nullable=True)
    total_active_seconds = Column(Integer, default=0)
    completed_pages = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)

    events = relationship("TelemetryEvent", back_populates="session", cascade="all, delete-orphan")


class PageTelemetry(Base):
    __tablename__ = "page_telemetry"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("course_units.id"), nullable=False)
    page_number = Column(Integer, nullable=False)
    dwell_seconds = Column(Float, default=0.0)
    revisits_count = Column(Integer, default=0)
    last_viewed_at = Column(DateTime, default=lambda: datetime.datetime.now(timezone.utc))


class TelemetryEvent(Base):
    __tablename__ = "telemetry_events"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("reading_sessions.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("course_units.id"), nullable=False)
    event_type = Column(String, nullable=False)  # OPEN, PAGE_ENTER, PAGE_LEAVE, DWELL_TICK, BLUR, FOCUS, CLOSE
    page_number = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(timezone.utc))
    metadata_json = Column(String, nullable=True)

    session = relationship("ReadingSession", back_populates="events")
