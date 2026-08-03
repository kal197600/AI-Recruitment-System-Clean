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


class CandidateEducation(Base):
    __tablename__ = "candidate_education"

    id = Column(
        Integer,
        primary_key=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    degree = Column(String(300))

    institution = Column(String(300))

    field = Column(String(200))

    start_date = Column(String(50))

    end_date = Column(String(50))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    candidate = relationship(
        "Candidate",
        back_populates="educations"
    )