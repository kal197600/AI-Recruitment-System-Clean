from __future__ import annotations

import logging
from typing import Any

from sqlalchemy import and_, func, select
from sqlalchemy.orm import Session, selectinload

from app.models.application import Application
from app.models.candidate import Candidate
from app.models.job import Job
from app.models.job_match import JobMatch
from app.models.screening_result import ScreeningResult

logger = logging.getLogger(__name__)


class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def get_summary(self) -> dict[str, int]:
        logger.info("Loading dashboard summary counts")

        total_candidates = self.db.scalar(
            select(func.count()).select_from(Candidate)
        ) or 0

        open_jobs = self.db.scalar(
            select(func.count()).select_from(Job).where(Job.status == "Open")
        ) or 0

        applications = self.db.scalar(
            select(func.count()).select_from(Application)
        ) or 0

        interviews = self.db.scalar(
            select(func.count()).select_from(Application).where(
                Application.status == "Interview"
            )
        ) or 0

        offers = self.db.scalar(
            select(func.count()).select_from(Application).where(
                Application.status == "Offer"
            )
        ) or 0

        hired = self.db.scalar(
            select(func.count()).select_from(Application).where(
                Application.status == "Hired"
            )
        ) or 0

        return {
            "total_candidates": total_candidates,
            "open_jobs": open_jobs,
            "applications": applications,
            "interviews": interviews,
            "offers": offers,
            "hired": hired,
        }

    def get_recent_applications(self, limit: int = 20) -> list[dict[str, Any]]:
        logger.info("Loading recent dashboard applications with limit=%s", limit)

        stmt = (
            select(
                Application.id.label("application_id"),
                Application.candidate_id,
                Candidate.full_name.label("candidate_name"),
                Application.job_id,
                Job.title.label("job_title"),
                JobMatch.overall_score.label("match_score"),
                ScreeningResult.overall_score.label("screening_score"),
                JobMatch.recommendation,
                Application.status,
                Application.applied_at,
            )
            .join(Candidate, Application.candidate)
            .join(Job, Application.job)
            .outerjoin(
                JobMatch,
                and_(
                    JobMatch.candidate_id == Application.candidate_id,
                    JobMatch.job_id == Application.job_id,
                ),
            )
            .outerjoin(
                ScreeningResult,
                ScreeningResult.application_id == Application.id,
            )
            .order_by(Application.applied_at.desc())
            .limit(limit)
        )

        rows = self.db.execute(stmt).all()

        applications = []

        for row in rows:
            applications.append(
                {
                    "application_id": row.application_id,
                    "candidate_id": row.candidate_id,
                    "candidate_name": row.candidate_name,
                    "job_id": row.job_id,
                    "job_title": row.job_title,
                    "match_score": float(row.match_score or 0),
                    "screening_score": float(row.screening_score or 0),
                    "recommendation": row.recommendation or "",
                    "status": row.status,
                    "applied_at": row.applied_at,
                }
            )

        return applications

    def get_application(self, application_id: int) -> dict[str, Any]:
        logger.info("Loading dashboard application %s", application_id)

        stmt = (
            select(Application)
            .options(
                selectinload(Application.candidate),
                selectinload(Application.job),
                selectinload(Application.screening_results),
            )
            .where(Application.id == application_id)
        )

        application = self.db.scalar(stmt)

        if application is None:
            logger.error("Application %s not found", application_id)
            raise ValueError(f"Application {application_id} not found")

        job_match = self.db.scalar(
            select(JobMatch).where(
                JobMatch.candidate_id == application.candidate_id,
                JobMatch.job_id == application.job_id,
            )
        )

        screening_result = (
            application.screening_results[0]
            if application.screening_results
            else None
        )

        return {
            "application": application,
            "candidate": application.candidate,
            "job": application.job,
            "job_match": job_match,
            "screening_result": screening_result,
        }
