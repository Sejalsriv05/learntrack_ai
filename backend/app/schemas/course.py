from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class UnitPageOut(BaseModel):
    id: int
    page_number: int
    title: str
    content: str
    key_concept: Optional[str] = None
    estimated_reading_sec: int

    model_config = ConfigDict(from_attributes=True)

class CourseUnitOut(BaseModel):
    id: int
    course_id: int
    unit_number: int
    title: str
    total_pages: int
    assigned_date: str
    description: Optional[str] = None
    pages: Optional[List[UnitPageOut]] = []

    model_config = ConfigDict(from_attributes=True)

class StudentCourseProgress(BaseModel):
    unit_id: int
    title: str
    total_pages: int
    viewed_pages: int
    completion_percentage: int
    status: str  # "Start reading", "Continue reading", "Review"

class CourseOut(BaseModel):
    id: int
    code: str
    name: str
    section: str
    description: Optional[str] = None
    units: List[CourseUnitOut] = []

    model_config = ConfigDict(from_attributes=True)
