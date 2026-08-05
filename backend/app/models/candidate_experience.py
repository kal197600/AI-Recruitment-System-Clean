from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    DateTime
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class CandidateExperience(Base):
    __tablename__ = "candidate_experience"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    company = Column(String(300))

    position = Column(String(300))

    start_date = Column(String(50))

    end_date = Column(String(50))

    description = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    candidate = relationship(
        "Candidate",
        back_populates="experiences"
    )