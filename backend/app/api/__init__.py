from app.api.auth import router as auth_router
from app.api.courses import router as courses_router
from app.api.telemetry import router as telemetry_router
from app.api.analytics import router as analytics_router
from app.api.insights import router as insights_router
from app.api.assistant import router as assistant_router

__all__ = [
    "auth_router",
    "courses_router",
    "telemetry_router",
    "analytics_router",
    "insights_router",
    "assistant_router"
]
