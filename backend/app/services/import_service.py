from app.database.database import SessionLocal
from app.services.job_matching_service import JobMatchingService

from app.services.email_service import EmailService
from app.services.storage_service import StorageService
from app.services.candidate_service import CandidateService

from app.ai.cv_parser import CVParser

from app.models import (
    CandidateFile,
    ImportedEmail,
)


class ImportService:

    def __init__(self):

        self.email_service = EmailService()
        self.storage_service = StorageService()
        self.cv_parser = CVParser()

    # ==========================================================
    # MAIN
    # ==========================================================

    def process_unread_emails(self):

        db = SessionLocal()

        try:

            self.email_service.connect()

            unread_ids = self.email_service.get_unread_email_ids()

            print("=" * 70)
            print(f"Unread Emails : {len(unread_ids)}")
            print("=" * 70)

            candidate_service = CandidateService(db)

            for email_id in unread_ids:

                try:
                    self.process_email(
                        db=db,
                        candidate_service=candidate_service,
                        email_id=email_id,
                    )

                except Exception as e:
                    db.rollback()
                    print(f"ERROR: {e}")

        finally:

            self.email_service.disconnect()
            db.close()

    # ==========================================================
    # EMAIL
    # ==========================================================

    def process_email(
        self,
        db,
        candidate_service,
        email_id,
    ):

        message = self.email_service.fetch_email(email_id)

        if message is None:
            return

        email_info = self.email_service.get_email_info(message)

        print()
        print("=" * 70)
        print(email_info["subject"])
        print("=" * 70)

        already_imported = (
            db.query(ImportedEmail)
            .filter(
                ImportedEmail.message_id == email_info["message_id"]
            )
            .first()
        )

        if already_imported:
            print("Already imported.")
            return

        attachments = self.email_service.get_cv_attachments(message)

        if not attachments:
            print("No CV attachment found.")
            return

        try:

            for attachment in attachments:

                self.process_attachment(
                    db=db,
                    candidate_service=candidate_service,
                    email_info=email_info,
                    attachment=attachment,
                )

            imported = ImportedEmail(
                message_id=email_info["message_id"],
                sender=email_info["from"],
                subject=email_info["subject"],
                processed=True,
            )

            db.add(imported)

            # Commit only once per email
            db.commit()

            print("Email imported successfully.")

        except Exception:
            db.rollback()
            raise

    # ==========================================================
    # ATTACHMENT
    # ATTACHMENT
    # ==========================================================

    def process_attachment(
        self,
        db,
        candidate_service,
        email_info,
        attachment,
    ):

        print(f"Processing attachment: {attachment['filename']}")

        print("STEP 1 - Saving attachment")

        storage = self.storage_service.save_attachment(
            attachment
        )

        print("STEP 2 - Attachment saved")

        print("STEP 3 - Parsing CV")

        candidate_data = self.cv_parser.parse(
            storage["filepath"]
        )

        print("STEP 4 - CV parsed")

        print("STEP 5 - Saving candidate")

        candidate = candidate_service.save_ai_candidate(
            candidate_data
        )

        print("STEP 6 - Candidate saved")

        candidate_file = CandidateFile(
            candidate_id=candidate.id,
            original_filename=storage["original_filename"],
            stored_filename=storage["stored_filename"],
            filepath=storage["filepath"],
            file_type="CV",
            mime_type=attachment.get("content_type"),
            file_size=storage["size"],
        )

        db.add(candidate_file)

        # Persist the uploaded file record before job matching so later
        # matching failures cannot roll it back.
        db.commit()
        db.refresh(candidate_file)

        matching_service = JobMatchingService(db)
        matching_service.run_matching(candidate.id)


