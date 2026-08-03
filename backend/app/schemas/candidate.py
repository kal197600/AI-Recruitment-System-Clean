from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class CandidateBase(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

    years_experience: Optional[float] = None

    current_position: Optional[str] = None
    current_company: Optional[str] = None

    original_summary: Optional[str] = None
    ai_summary: Optional[str] = None

    linkedin: Optional[str] = None

    source: Optional[str] = "Manual"

    ai_model: Optional[str] = None


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

    years_experience: Optional[float] = None

    current_position: Optional[str] = None
    current_company: Optional[str] = None

    original_summary: Optional[str] = None
    ai_summary: Optional[str] = None

    linkedin: Optional[str] = None

    source: Optional[str] = None

    ai_model: Optional[str] = None


class CandidateResponse(CandidateBase):
    id: int
    screening_status: str = "Not Screened"
    overall_score: float | None = None
    recommendation: str | None = None
    screening_date: datetime | None = None

    model_config = ConfigDict(from_attributes=True)