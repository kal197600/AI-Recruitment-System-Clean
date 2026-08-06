from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.ai.ai_service import AIService
from app.models.application import Application
from app.models.candidate import Candidate
from app.models.candidate_file import CandidateFile
from app.models.job import Job
from app.models.job_match import JobMatch
from app.parsers.pdf_parser import PDFParser
from app.parsers.docx_parser import DOCXParser
from app.services.application_service import ApplicationService

logger = logging.getLogger(__name__)


class JobMatchingService:
    """
    Service responsible for matching a candidate against open jobs
    and persisting AI-generated job match results.
    """

    MIN_MATCH_SCORE = 60.0

    def __init__(self, db: Session):
        self.db = db
        self.ai_service = AIService()
        self.pdf_parser = PDFParser()
        self.docx_parser = DOCXParser()

    def run_matching(self, candidate_id: int) -> dict[str, Any]:
        logger.info("Starting job matching for candidate_id=%s", candidate_id)

        try:
            candidate = self._load_candidate(candidate_id)
            logger.info("Candidate loaded")

            latest_file = self._load_latest_file(candidate_id)
            logger.info("Candidate file loaded")

            resume_text = self._extract_resume_text(latest_file)
            logger.info("Resume extracted")

            jobs = self._load_open_jobs()
            logger.info("Jobs loaded")

            if not jobs:
                logger.info("No open jobs found for candidate_id=%s", candidate_id)
                return {
                    "candidate": candidate,
                    "best_job_id": None,
                    "matches": [],
                }

            job_payload = [
                {
                    "job_id": job.id,
                    "title": job.title,
                    "description": job.description or "",
                }
                for job in jobs
            ]

            logger.info("Calling AI match_candidate_to_jobs()")
            logger.info(
                "Calling AI job matching for candidate_id=%s against %s open jobs",
                candidate_id,
                len(job_payload),
            )

            result = self.ai_service.match_candidate_to_jobs(
                resume_text=resume_text,
                jobs=job_payload,
            )
            logger.info("AI matching completed")

            matches = getattr(result, "matches", [])
            best_job_id = getattr(result, "best_job_id", None)

            logger.info("Saving matches")
            self._save_matches(candidate.id, matches)

            overall_score = 0.0
            if best_job_id is not None:
                matched_item = next(
                    (
                        item
                        for item in matches
                        if self._get_value(item, "job_id") == best_job_id
                    ),
                    None,
                )
                overall_score = self._to_float(matched_item, "overall_score")

            if best_job_id is None or overall_score < self.MIN_MATCH_SCORE:
                application = None
                screening = None
                message = f"No suitable job found. Highest match score was {overall_score:.1f}%."
                logger.info(
                    "No suitable job found for candidate %s. Highest score: %.1f%%",
                    candidate_id,
                    overall_score,
                )
                best_job_id = None
                matched = False
            else:
                application_service = ApplicationService()
                logger.info("Creating application")
                application_result = application_service.create_from_best_match(
                    db=self.db,
                    candidate_id=candidate.id,
                    best_job_id=best_job_id,
                )

                application = application_result["application"]
                screening = application_result["screening"]
                logger.info("Application created")

                latest_application = (
                    self.db.query(Application)
                    .filter(Application.candidate_id == candidate.id)
                    .order_by(Application.applied_at.desc())
                    .first()
                )

                if latest_application is not None:
                    latest_application.job_id = best_job_id
                    self.db.commit()
                    self.db.refresh(latest_application)
                    logger.info(
                        "Updated latest application %s to matched job %s",
                        latest_application.id,
                        best_job_id,
                    )
                matched = True
                message = "Candidate matched successfully."

            logger.info(
                "Finished job matching for candidate_id=%s best_job_id=%s",
                candidate_id,
                best_job_id,
            )
            logger.info("Matching finished successfully")

            return {
                "candidate": candidate,
                "best_job_id": best_job_id,
                "matches": matches,
                "application": application,
                "screening": screening,
                "matched": matched,
                "message": message,
            }
        except Exception:
            logger.exception("JobMatchingService failed")
            raise

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------

    def _load_candidate(self, candidate_id: int) -> Candidate:
        stmt = (
            select(Candidate)
            .options(selectinload(Candidate.files))
            .where(Candidate.id == candidate_id)
        )

        candidate = self.db.scalar(stmt)

        if candidate is None:
            logger.error("Candidate %s not found", candidate_id)
            raise ValueError(f"Candidate {candidate_id} not found")

        return candidate

    def _load_latest_file(self, candidate_id: int) -> CandidateFile:
        stmt = (
            select(CandidateFile)
            .where(
                CandidateFile.candidate_id == candidate_id,
                CandidateFile.is_latest.is_(True),
            )
            .order_by(CandidateFile.id.desc())
        )

        candidate_file = self.db.scalar(stmt)

        if candidate_file is None:
            logger.error("Latest file not found for candidate_id=%s", candidate_id)
            raise ValueError("Latest candidate file not found")

        return candidate_file

    def _load_open_jobs(self) -> list[Job]:
        stmt = (
            select(Job)
            .where(Job.status == "Open")
            .order_by(Job.id)
        )

        return list(self.db.scalars(stmt).all())

    # ------------------------------------------------------------------
    # Resume parsing
    # ------------------------------------------------------------------

    def _extract_resume_text(self, candidate_file: CandidateFile) -> str:
        filepath = getattr(candidate_file, "filepath", None)

        if not filepath:
            logger.error(
                "Candidate file path missing for candidate_id=%s",
                candidate_file.candidate_id,
            )
            raise ValueError("Candidate file path not found")

        suffix = str(filepath).lower()

        if suffix.endswith(".pdf"):
            return self.pdf_parser.extract_text(filepath)

        if suffix.endswith(".docx"):
            return self.docx_parser.extract_text(filepath)

        logger.error("Unsupported resume format: %s", suffix)
        raise ValueError(f"Unsupported resume format: {suffix}")

    # ------------------------------------------------------------------
    # Persistence
    # ------------------------------------------------------------------

    def _save_matches(self, candidate_id: int, matches: list[Any]) -> None:
        try:
            for item in matches:
                job_id = self._get_value(item, "job_id")
                if job_id is None:
                    continue

                stmt = (
                    select(JobMatch)
                    .where(
                        JobMatch.candidate_id == candidate_id,
                        JobMatch.job_id == job_id,
                    )
                )

                record = self.db.scalar(stmt)

                if record is None:
                    record = JobMatch(
                        candidate_id=candidate_id,
                        job_id=job_id,
                    )
                    self.db.add(record)

                record.overall_score = self._to_float(item, "overall_score")
                record.skills_score = self._to_float(item, "skills_score")
                record.experience_score = self._to_float(item, "experience_score")
                record.education_score = self._to_float(item, "education_score")
                record.language_score = self._to_float(item, "language_score")
                record.certification_score = self._to_float(item, "certification_score")
                record.recommendation = self._normalize_text(item, "recommendation")
                record.strengths = self._normalize_list(item, "strengths")
                record.weaknesses = self._normalize_list(item, "weaknesses")
                record.missing_skills = self._normalize_list(item, "missing_skills")
                record.reasoning = self._normalize_text(item, "reasoning")
                record.ai_model = self.ai_service.model

            self.db.commit()
        except Exception:
            logger.exception(
                "Failed to persist job matches for candidate_id=%s",
                candidate_id,
            )
            self.db.rollback()
            raise

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _get_value(item: Any, field: str) -> Any:
        if isinstance(item, dict):
            return item.get(field)

        return getattr(item, field, None)

    @staticmethod
    def _to_float(item: Any, field: str) -> float:
        value = JobMatchingService._get_value(item, field)

        try:
            return float(value) if value is not None else 0.0
        except (TypeError, ValueError):
            return 0.0

    @staticmethod
    def _normalize_text(item: Any, field: str) -> str:
        value = JobMatchingService._get_value(item, field)

        if value is None:
            return ""

        if isinstance(value, list):
            return "\n".join(str(item) for item in value if item is not None)

        return str(value)

    @staticmethod
    def _normalize_list(item: Any, field: str) -> str:
        value = JobMatchingService._get_value(item, field)

        if value is None:
            return ""

        if isinstance(value, list):
            return "\n".join(str(item) for item in value if item is not None)

        return str(value)

    @staticmethod
    def _find_best_job(matches: list[Any]) -> int | None:
        if not matches:
            return None

        def score(item: Any) -> float:
            if isinstance(item, dict):
                return float(
                    item.get("match_score")
                    or item.get("score")
                    or 0
                )

            return float(
                getattr(item, "match_score", None)
                or getattr(item, "score", None)
                or 0
            )

        best = max(matches, key=score)

        if isinstance(best, dict):
            return best.get("job_id")

        return getattr(best, "job_id", None)