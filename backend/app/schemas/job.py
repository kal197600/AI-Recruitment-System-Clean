from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ==========================================================
# Base Schema
# ==========================================================

class JobBase(BaseModel):
    title: str

    department: Optional[str] = None

    location: Optional[str] = None

    description: Optional[str] = None

    required_skills: Optional[str] = None

    minimum_experience: Optional[int] = None

    employment_type: Optional[str] = None

    status: str = "Open"


# ==========================================================
# Create
# ==========================================================

class JobCreate(JobBase):
    pass


# ==========================================================
# Update
# ==========================================================

class JobUpdate(BaseModel):
    title: Optional[str] = None

    department: Optional[str] = None

    location: Optional[str] = None

    description: Optional[str] = None

    required_skills: Optional[str] = None

    minimum_experience: Optional[int] = None

    employment_type: Optional[str] = None

    status: Optional[str] = None


# ==========================================================
# Response
# ==========================================================

class JobResponse(JobBase):
    id: int

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)