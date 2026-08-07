from __future__ import annotations

import logging

from app.services.import_service import ImportService

logger = logging.getLogger(__name__)


def run_email_import() -> None:
    """
    Scheduled job that imports unread emails.
    """
    print("=== EMAIL IMPORT STARTED ===")

    try:
        logger.info("Scheduled email import started.")

        print("Calling email import service...")
        import_service = ImportService()
        import_service.process_unread_emails()
        print("Email import service finished.")

        logger.info("Scheduled email import completed successfully.")

    except Exception as e:
        print(f"EMAIL IMPORT FAILED: {e}")
        logger.exception("Scheduled email import failed.")
        raise