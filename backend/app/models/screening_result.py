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


class ScreeningResult(Base):
    __tablename__ = "screening_results"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    application_id = Column(
        Integer,
        ForeignKey("applications.id"),
        nullable=False,
        unique=True,
    )

    overall_score = Column(
        Float,
        default=0,
    )

    technical_score = Column(
        Float,
        default=0,
    )

    experience_score = Column(
        Float,
        default=0,
    )

    education_score = Column(
        Float,
        default=0,
    )

    skills_score = Column(
        Float,
        default=0,
    )

    recommendation = Column(
        String(50),
    )

    strengths = Column(
        Text,
    )

    weaknesses = Column(
        Text,
    )

    missing_skills = Column(
        Text,
    )

    reasoning = Column(
        Text,
    )

    ai_model = Column(
        String(100),
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    application = relationship(
        "Application",
        back_populates="screening_results",
    )