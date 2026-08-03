import logging

from sqlalchemy.orm import Session

from app.models import (
    Application,
    CandidateFile,
    ScreeningResult,
)
from app.services.screening_service import ScreeningService

logger = logging.getLogger(__name__)


class ApplicationService:
    """
    Handles automatic application creation from AI Job Matching.
    """

    def __init__(self):
        self.screening_service = ScreeningService()

    def create_from_best_match(
        self,
        db: Session,
        candidate_id: int,
        best_job_id: int,
    ):
        """
        Create an application from the best matched job.

        Workflow:
            1. Load latest candidate file
            2. Check if application already exists
            3. Create application if needed
            4. Run AI screening
            5. Return application and screening
        """

        if best_job_id is None:
            raise ValueError("No matching job was selected.")

        # --------------------------------------------------
        # Latest Candidate File
        # --------------------------------------------------

        candidate_file = (
            db.query(CandidateFile)
            .filter(
                CandidateFile.candidate_id == candidate_id,
                CandidateFile.is_latest.is_(True),
            )
            .first()
        )

        if candidate_file is None:
            raise ValueError("Latest candidate file not found.")

        # --------------------------------------------------
        # Existing Application
        # --------------------------------------------------

        application = (
            db.query(Application)
            .filter(
                Application.candidate_id == candidate_id,
                Application.job_id == best_job_id,
            )
            .first()
        )

        if application:

            logger.info(
                "Application already exists "
                "(candidate=%s job=%s)",
                candidate_id,
                best_job_id,
            )

            screening = (
                db.query(ScreeningResult)
                .filter(
                    ScreeningResult.application_id == application.id
                )
                .first()
            )

            return {
                "application": application,
                "screening": screening,
            }

        # --------------------------------------------------
        # Create Application
        # --------------------------------------------------

        try:

            application = Application(
                candidate_id=candidate_id,
                job_id=best_job_id,
                candidate_file_id=candidate_file.id,
                status="Applied",
                source="AI Matching",
            )

            db.add(application)

            db.commit()

            db.refresh(application)

            logger.info(
                "Application created "
                "(candidate=%s job=%s)",
                candidate_id,
                best_job_id,
            )

        except Exception:

            db.rollback()

            logger.exception(
                "Failed to create application "
                "(candidate=%s job=%s)",
                candidate_id,
                best_job_id,
            )

            raise

        # --------------------------------------------------
        # AI Screening
        # --------------------------------------------------

        screening = self.screening_service.run_screening(
            db=db,
            application_id=application.id,
        )

        logger.info(
            "AI screening completed "
            "for application %s",
            application.id,
        )

        return {
            "application": application,
            "screening": screening,
        }