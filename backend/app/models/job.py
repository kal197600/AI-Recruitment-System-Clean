from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(
        Integer,
        primary_key=True
    )

    title = Column(
        String(200),
        nullable=False
    )

    department = Column(
        String(200)
    )

    location = Column(
        String(200)
    )

    description = Column(
        Text
    )

    # AI will later extract these from the job description
    required_skills = Column(
        Text
    )

    minimum_experience = Column(
        Integer
    )

    # Full-Time, Part-Time, Contract, Internship...
    employment_type = Column(
        String(50)
    )

    # Draft, Open, Closed, Archived
    status = Column(
        String(50),
        default="Open"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    applications = relationship(
        "Application",
        back_populates="job",
        cascade="all, delete-orphan"
    )

    job_matches = relationship(
        "JobMatch",
        back_populates="job",
        cascade="all, delete-orphan"
    )