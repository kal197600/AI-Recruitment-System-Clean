from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ==========================================================
# Base
# ==========================================================

class ApplicationBase(BaseModel):
    candidate_id: int
    job_id: int

    status: str = "Applied"
    source: str = "Manual"
    notes: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    pass


# ==========================================================
# Create
# ==========================================================

class ApplicationCreate(ApplicationBase):
    """
    candidate_file_id is intentionally omitted.

    The backend automatically selects the latest
    CandidateFile for the chosen candidate.
    """
    pass


# ==========================================================
# Update
# ==========================================================

class ApplicationUpdate(BaseModel):
    candidate_id: Optional[int] = None
    job_id: Optional[int] = None
    candidate_file_id: Optional[int] = None

    status: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None


# ==========================================================
# Response
# ==========================================================

class ApplicationResponse(ApplicationBase):
    id: int

    candidate_file_id: int

    candidate_name: str | None = None
    job_title: str | None = None

    applied_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)