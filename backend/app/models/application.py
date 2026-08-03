from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    job_id = Column(
        Integer,
        ForeignKey("jobs.id"),
        nullable=False
    )

    candidate_file_id = Column(
        Integer,
        ForeignKey("candidate_files.id"),
        nullable=False
    )

    # Applied, Screening, Interview, Offer,
    # Rejected, Hired
    status = Column(
        String(50),
        default="Applied"
    )

    # Email, Website, LinkedIn,
    # Referral, Manual
    source = Column(
        String(50),
        default="Email"
    )

    notes = Column(
        Text
    )

    applied_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # ==================================================
    # Relationships
    # ==================================================

    candidate = relationship(
        "Candidate",
        back_populates="applications"
    )

    job = relationship(
        "Job",
        back_populates="applications"
    )

    candidate_file = relationship(
        "CandidateFile",
        back_populates="applications"
    )

    screening_results = relationship(
        "ScreeningResult",
        back_populates="application",
        cascade="all, delete-orphan"
    )