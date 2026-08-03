from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean
)

from sqlalchemy.sql import func

from app.database.database import Base


class ImportedEmail(Base):

    __tablename__ = "imported_emails"

    id = Column(
        Integer,
        primary_key=True
    )

    message_id = Column(
        String(500),
        unique=True,
        nullable=False
    )

    sender = Column(
        String(300)
    )

    subject = Column(
        String(500)
    )

    processed = Column(
        Boolean,
        default=True
    )

    imported_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )