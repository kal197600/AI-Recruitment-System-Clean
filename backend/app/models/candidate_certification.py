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


class CandidateCertification(Base):
    __tablename__ = "candidate_certifications"

    id = Column(
        Integer,
        primary_key=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    certificate = Column(String(300))

    issuer = Column(String(300))

    issue_date = Column(String(50))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    candidate = relationship(
        "Candidate",
        back_populates="certifications"
    )