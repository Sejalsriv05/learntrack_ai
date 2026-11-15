from pydantic import BaseModel
from typing import List, Optional
import datetime

class TelemetryEventIn(BaseModel):
    event_type: str  # OPEN, PAGE_ENTER, PAGE_LEAVE, DWELL_TICK, BLUR, FOCUS, CLOSE
    page_number: int
    dwell_delta_seconds: Optional[float] = 0.0
    timestamp: Optional[datetime.datetime] = None
    metadata: Optional[dict] = None

class TelemetryBatchIn(BaseModel):
    unit_id: int
    session_id: Optional[int] = None
    events: List[TelemetryEventIn]

class SessionStartIn(BaseModel):
    unit_id: int

class SessionStartOut(BaseModel):
    session_id: int
    unit_id: int
    started_at: datetime.datetime

class SessionEndIn(BaseModel):
    session_id: int
    unit_id: int
    total_active_seconds: int
    completed_pages: int
    is_completed: bool = False
