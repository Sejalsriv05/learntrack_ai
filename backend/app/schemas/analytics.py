from pydantic import BaseModel
from typing import List, Optional

class HeatmapPageStat(BaseModel):
    page_number: int
    average_dwell_seconds: float
    formatted_dwell: str
    revisit_count: int
    heat_level: int  # 0 to 4
    key_concept: Optional[str] = None
    is_bottleneck: bool = False

class StudentRosterItem(BaseModel):
    student_id: int
    name: str
    email: str
    completion_percentage: int
    active_minutes: int
    revisits: int
    engagement_level: str  # "High", "Moderate", "Low", "Unusual"
    pattern_description: str
    needs_check_in: bool

class UnitAnalyticsOverview(BaseModel):
    unit_id: int
    course_name: str
    course_code: str
    section: str
    unit_title: str
    assigned_date: str
    total_pages: int
    enrolled_count: int
    active_students_count: int
    average_completion: int
    average_active_minutes: int
    check_in_count: int
    heatmap: List[HeatmapPageStat]
    students: List[StudentRosterItem]

class CourseBottleneckInsight(BaseModel):
    page_range: str
    pages: List[int]
    topic: str
    severity: str  # "High", "Moderate"
    average_dwell_ratio: float
    revisit_frequency: int
    cohort_impact_pct: int
    pedagogical_recommendation: str

class CheckInRecommendation(BaseModel):
    student_id: int
    student_name: str
    engagement_level: str
    status_summary: str
    suggested_email_subject: str
    suggested_message: str
