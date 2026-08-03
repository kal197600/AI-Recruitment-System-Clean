from typing import List

from pydantic import BaseModel, Field


class WorkExperience(BaseModel):
    position: str = ""
    company: str = ""
    start_date: str = ""
    end_date: str = ""
    description: str = ""


class Education(BaseModel):
    degree: str = ""
    institution: str = ""
    field: str = ""
    start_date: str = ""
    end_date: str = ""


class Certification(BaseModel):
    certificate: str = ""
    issuer: str = ""
    issue_date: str = ""


class Language(BaseModel):
    language: str = ""
    level: str = ""


class CandidateExtraction(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin: str = ""

    years_experience: float = 0.0

    current_position: str = ""
    current_company: str = ""

    original_summary: str = ""
    ai_summary: str = ""

    skills: list[str] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    work_experience: list[WorkExperience] = Field(default_factory=list)
    languages: list[Language] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)


class ScreeningResultAI(BaseModel):
    overall_score: float = 0.0
    technical_score: float = 0.0
    experience_score: float = 0.0
    education_score: float = 0.0
    skills_score: float = 0.0

    recommendation: str = ""

    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)

    reasoning: str = ""

    ai_model: str = ""


# ==========================================================
# AI Job Matching
# ==========================================================

class JobMatchAI(BaseModel):
    job_id: int

    overall_score: float = Field(ge=0, le=100)
    skills_score: float = Field(ge=0, le=100)
    experience_score: float = Field(ge=0, le=100)
    education_score: float = Field(ge=0, le=100)
    language_score: float = Field(ge=0, le=100)
    certification_score: float = Field(ge=0, le=100)

    recommendation: str

    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)

    reasoning: str


class JobMatchingResponse(BaseModel):
    best_job_id: int
    matches: List[JobMatchAI]
