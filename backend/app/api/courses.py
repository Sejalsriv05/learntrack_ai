from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.course import Course, CourseUnit, UnitPage
from app.models.telemetry import ReadingSession
from app.models.user import User
from app.schemas.course import CourseOut, CourseUnitOut, UnitPageOut, StudentCourseProgress
from app.api.auth import get_current_user

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("/", response_model=List[CourseOut])
async def list_courses(db: AsyncSession = Depends(get_db)):
    stmt = select(Course).options(selectinload(Course.units).selectinload(CourseUnit.pages))
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/units/{unit_id}", response_model=CourseUnitOut)
async def get_unit(unit_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(CourseUnit).options(selectinload(CourseUnit.pages)).where(CourseUnit.id == unit_id)
    result = await db.execute(stmt)
    unit = result.scalar_one_or_none()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    # Sort pages by page_number
    unit.pages.sort(key=lambda p: p.page_number)
    return unit

@router.get("/my-progress", response_model=List[StudentCourseProgress])
async def get_student_progress(
    user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    student_id = user.id if user else 2  # default student

    # Get all units
    stmt = select(CourseUnit).order_by(CourseUnit.unit_number)
    result = await db.execute(stmt)
    units = result.scalars().all()

    progress_list = []
    for u in units:
        # Check sessions for this student and unit
        sess_stmt = select(ReadingSession).where(
            ReadingSession.student_id == student_id,
            ReadingSession.unit_id == u.id
        ).order_by(ReadingSession.started_at.desc())
        sess_res = await db.execute(sess_stmt)
        session = sess_res.scalars().first()

        viewed = session.completed_pages if session else 0
        if u.unit_number == 2:
            viewed = u.total_pages  # 25 of 25 (Unit 2 is finished in prototype)
        elif u.unit_number == 3:
            viewed = 18 if not session else max(viewed, 18)  # 18 of 25 in prototype
        elif u.unit_number == 4:
            viewed = 0 if not session else viewed  # 0 of 30

        pct = min(100, int(round((viewed / max(1, u.total_pages)) * 100)))
        status = "Start reading" if pct == 0 else ("Review" if pct == 100 else "Continue reading")

        progress_list.append(StudentCourseProgress(
            unit_id=u.id,
            title=u.title,
            total_pages=u.total_pages,
            viewed_pages=viewed,
            completion_percentage=pct,
            status=status
        ))

    return progress_list
