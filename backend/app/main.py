from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.candidate_files import router as candidate_file_router
from app.api.candidates import router as candidate_router
from app.api.dashboard import router as dashboard_router
from app.api.import_email import router as import_router
from app.api.job_matching import router as job_matching_router
from app.api.jobs import router as job_router
from app.api.reports import router as reports_router
from app.api.screening import router as screening_router
from app.api.applications import router as application_router

from app.database.database import Base, engine

from app.scheduler.startup import initialize_scheduler
from app.scheduler.scheduler import shutdown_scheduler

# Import all models so SQLAlchemy registers them
from app.models.application import Application
from app.models.candidate import Candidate
from app.models.candidate_file import CandidateFile
from app.models.imported_email import ImportedEmail
from app.models.job import Job
from app.models.screening_result import ScreeningResult

Base.metadata.create_all(bind=engine)


def _env_flag(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _allowed_origins() -> list[str]:
    configured = os.getenv("ALLOWED_ORIGINS", "")
    origins = [origin.strip() for origin in configured.split(",") if origin.strip()]
    return origins or [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ]


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler_enabled = _env_flag("ENABLE_SCHEDULER", default=True)

    if scheduler_enabled:
        initialize_scheduler()

    yield

    if scheduler_enabled:
        shutdown_scheduler()


app = FastAPI(
    title="AI Recruitment System",
    version="1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidate_router)
app.include_router(job_router)
app.include_router(application_router)
app.include_router(import_router)
app.include_router(screening_router)
app.include_router(reports_router)
app.include_router(candidate_file_router)
app.include_router(job_matching_router)

app.include_router(dashboard_router)


@app.get("/")
def home():
    return {
        "status": "running",
        "message": "AI Recruitment System API",
    }