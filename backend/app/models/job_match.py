from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Overall AI Score
    overall_score = Column(Float, default=0.0)

    # Detailed Scores
    skills_score = Column(Float, default=0.0)
    experience_score = Column(Float, default=0.0)
    education_score = Column(Float, default=0.0)
    language_score = Column(Float, default=0.0)
    certification_score = Column(Float, default=0.0)

    recommendation = Column(
        String(50),
        default="Not Evaluated",
    )

    strengths = Column(Text)
    weaknesses = Column(Text)
    missing_skills = Column(Text)
    reasoning = Column(Text)

    ai_model = Column(String(100))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    candidate = relationship(
        "Candidate",
        back_populates="job_matches",
    )

    job = relationship(
        "Job",
        back_populates="job_matches",
    )