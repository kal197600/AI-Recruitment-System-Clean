<<<<<<< HEAD
from datetime import datetime
=======
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656
from typing import Optional

from pydantic import BaseModel, ConfigDict


class CandidateBase(BaseModel):
    full_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

<<<<<<< HEAD
    # Changed from int to float
    years_experience: Optional[float] = None
=======
    years_experience: Optional[int] = None
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656

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

<<<<<<< HEAD
    # Changed from int to float
    years_experience: Optional[float] = None
=======
    years_experience: Optional[int] = None
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656

    current_position: Optional[str] = None
    current_company: Optional[str] = None

    original_summary: Optional[str] = None
    ai_summary: Optional[str] = None

    linkedin: Optional[str] = None

    source: Optional[str] = None

    ai_model: Optional[str] = None


class CandidateResponse(CandidateBase):
    id: int
<<<<<<< HEAD
    screening_status: str = "Not Screened"
    overall_score: float | None = None
    recommendation: str | None = None
    screening_date: datetime | None = None
=======
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656

    model_config = ConfigDict(from_attributes=True)