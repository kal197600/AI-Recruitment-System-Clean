from __future__ import annotations

import logging

from app.services.import_service import ImportService

logger = logging.getLogger(__name__)


def run_email_import() -> None:
    """
    Scheduled job that imports unread emails.
    """
    logger.info("Scheduled email import started.")

    try:
        import_service = ImportService()
        import_service.process_unread_emails()

        logger.info("Scheduled email import completed successfully.")

    except Exception:
        logger.exception("Scheduled email import failed.")