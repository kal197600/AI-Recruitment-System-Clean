from datetime import datetime

from pydantic import BaseModel, ConfigDict


class DashboardSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_candidates: int
    open_jobs: int
    applications: int
    interviews: int
    offers: int
    hired: int


class DashboardApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    application_id: int

    candidate_id: int
    candidate_name: str

    job_id: int
    job_title: str

    match_score: float
    screening_score: float

    recommendation: str

    status: str

    applied_at: datetime
