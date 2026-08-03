from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    Text,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String(200),
        nullable=False
    )

    email = Column(
        String(200),
        unique=True
    )

    phone = Column(
        String(50)
    )

    location = Column(
        String(200)
    )

    linkedin = Column(
        String(300)
    )

    # Allow decimal years (e.g. 3.5 years)
    years_experience = Column(
        Float,
        default=0.0
    )

    current_position = Column(
        String(200)
    )

    current_company = Column(
        String(200)
    )

    # =============================================
    # Resume Information
    # =============================================

    original_summary = Column(Text)

    ai_summary = Column(Text)

    # =============================================
    # Candidate Source
    # =============================================

    source = Column(
        String(50),
        default="Email"
    )

    # =============================================
    # AI Metadata
    # =============================================

    ai_model = Column(
        String(100)
    )

    ai_processed_at = Column(
        DateTime(timezone=True)
    )

    # =============================================
    # Timestamps
    # =============================================

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # =============================================
    # Relationships
    # =============================================

    files = relationship(
        "CandidateFile",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )

    skills = relationship(
        "CandidateSkill",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )

    educations = relationship(
        "CandidateEducation",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )

    experiences = relationship(
        "CandidateExperience",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )

    languages = relationship(
        "CandidateLanguage",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )

    certifications = relationship(
        "CandidateCertification",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )

    applications = relationship(
        "Application",
        back_populates="candidate",
        cascade="all, delete-orphan"
    )

    job_matches = relationship(
        "JobMatch",
        back_populates="candidate",
        cascade="all, delete-orphan",
    )