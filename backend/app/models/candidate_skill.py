from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(
        Integer,
        primary_key=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    skill = Column(
        String(150),
        nullable=False
    )

    level = Column(
        String(50)
    )

    source = Column(
        String(50),
        default="AI"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    candidate = relationship(
        "Candidate",
        back_populates="skills"
    )