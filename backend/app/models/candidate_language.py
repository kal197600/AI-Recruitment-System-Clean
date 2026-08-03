from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class CandidateLanguage(Base):
    __tablename__ = "candidate_languages"

    id = Column(
        Integer,
        primary_key=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    language = Column(
        String(100)
    )

    level = Column(
        String(50)
    )

    candidate = relationship(
        "Candidate",
        back_populates="languages"
    )