from datetime import timezone
import datetime
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.telemetry import ReadingSession, PageTelemetry, TelemetryEvent
from app.models.user import User
from app.schemas.telemetry import (
    SessionStartIn, SessionStartOut,
    SessionEndIn, TelemetryBatchIn
)
from app.api.auth import get_current_user

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])

@router.post("/sessions/start", response_model=SessionStartOut)
async def start_session(
    payload: SessionStartIn,
    user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    student_id = user.id if user else 2
    session = ReadingSession(
        student_id=student_id,
        unit_id=payload.unit_id,
        started_at=datetime.datetime.now(timezone.utc),
        total_active_seconds=0,
        completed_pages=1,
        is_completed=False
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)

    # Log initial OPEN event
    open_event = TelemetryEvent(
        session_id=session.id,
        student_id=student_id,
        unit_id=payload.unit_id,
        event_type="OPEN",
        page_number=1,
        timestamp=datetime.datetime.now(timezone.utc)
    )
    db.add(open_event)
    await db.commit()

    return SessionStartOut(
        session_id=session.id,
        unit_id=session.unit_id,
        started_at=session.started_at
    )

@router.post("/sessions/end")
async def end_session(
    payload: SessionEndIn,
    user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ReadingSession).where(ReadingSession.id == payload.session_id)
    res = await db.execute(stmt)
    session = res.scalar_one_or_none()
    if session:
        session.ended_at = datetime.datetime.now(timezone.utc)
        session.total_active_seconds = payload.total_active_seconds
        session.completed_pages = payload.completed_pages
        session.is_completed = payload.is_completed
        await db.commit()
    return {"status": "ok", "message": "Session completed"}

@router.post("/batch")
async def ingest_telemetry_batch(
    batch: TelemetryBatchIn,
    user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    student_id = user.id if user else 2

    for ev in batch.events:
        # 1. Insert raw event record
        event_record = TelemetryEvent(
            session_id=batch.session_id,
            student_id=student_id,
            unit_id=batch.unit_id,
            event_type=ev.event_type,
            page_number=ev.page_number,
            timestamp=ev.timestamp or datetime.datetime.now(timezone.utc),
            metadata_json=json.dumps(ev.metadata) if ev.metadata else None
        )
        db.add(event_record)

        # 2. Update page telemetry aggregations
        stmt = select(PageTelemetry).where(
            PageTelemetry.student_id == student_id,
            PageTelemetry.unit_id == batch.unit_id,
            PageTelemetry.page_number == ev.page_number
        )
        res = await db.execute(stmt)
        pt = res.scalar_one_or_none()

        if not pt:
            pt = PageTelemetry(
                student_id=student_id,
                unit_id=batch.unit_id,
                page_number=ev.page_number,
                dwell_seconds=float(ev.dwell_delta_seconds or 0.0),
                revisits_count=1 if ev.event_type == "PAGE_ENTER" else 0,
                last_viewed_at=datetime.datetime.now(timezone.utc)
            )
            db.add(pt)
        else:
            if ev.dwell_delta_seconds and ev.dwell_delta_seconds > 0:
                pt.dwell_seconds += float(ev.dwell_delta_seconds)
            if ev.event_type == "PAGE_ENTER":
                pt.revisits_count += 1
            pt.last_viewed_at = datetime.datetime.now(timezone.utc)

    # Update active session seconds if provided
    if batch.session_id:
        sess_stmt = select(ReadingSession).where(ReadingSession.id == batch.session_id)
        sess_res = await db.execute(sess_stmt)
        session = sess_res.scalar_one_or_none()
        if session:
            total_dwell_delta = sum(ev.dwell_delta_seconds or 0 for ev in batch.events)
            session.total_active_seconds += int(round(total_dwell_delta))
            # Track max page as completed pages
            max_page = max([ev.page_number for ev in batch.events] + [session.completed_pages])
            session.completed_pages = max_page

    await db.commit()
    return {"status": "ok", "received_events": len(batch.events)}
