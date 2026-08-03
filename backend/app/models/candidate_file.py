from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    BigInteger
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class CandidateFile(Base):
    __tablename__ = "candidate_files"

    id = Column(
        Integer,
        primary_key=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    # Original uploaded filename
    original_filename = Column(
        String(300),
        nullable=False
    )

    # Internal unique filename
    stored_filename = Column(
        String(300),
        nullable=False
    )

    # Example:
    # uploads/2026/07/8a4b9f2e.pdf
    filepath = Column(
        String(500),
        nullable=False
    )

    # CV, CoverLetter, Portfolio, Certificate...
    file_type = Column(
        String(50),
        nullable=False
    )

    # application/pdf
    mime_type = Column(
        String(100)
    )

    # File size in bytes
    file_size = Column(
        BigInteger
    )

    # SHA-256 hash for duplicate detection
    checksum = Column(
        String(64)
    )

    # Indicates whether this is the latest version
    is_latest = Column(
        Boolean,
        default=True
    )

    uploaded_at = Column(
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
        back_populates="files"
    )

    applications = relationship(
        "Application",
        back_populates="candidate_file",
        cascade="all, delete-orphan"
    )