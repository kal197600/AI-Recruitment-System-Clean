from io import BytesIO
from typing import Any, Dict, List

from sqlalchemy.orm import Session

from app.models import (
    Application,
    Candidate,
    Job,
    ScreeningResult,
)
from app.utils.pdf_generator import generate_pdf
from app.utils.excel_generator import generate_excel


class ReportService:
    def export_report(self, report_type: str, file_format: str, db: Session):
        report_data = self._build_report_data(report_type, db)

        if file_format == "pdf":
            pdf_bytes = generate_pdf(report_type, report_data)
            return pdf_bytes, "application/pdf"

        if file_format == "excel":
            excel_bytes = generate_excel(report_type, report_data)
            return excel_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        raise ValueError(f"Unsupported export format: {file_format}")

    def _build_report_data(self, report_type: str, db: Session) -> Dict[str, Any]:
        if report_type == "dashboard":
            return self._build_dashboard_data(db)

        if report_type == "candidates":
            return self._build_candidates_data(db)

        if report_type == "jobs":
            return self._build_jobs_data(db)

        if report_type == "applications":
            return self._build_applications_data(db)

        if report_type == "screening":
            return self._build_screening_data(db)

        raise ValueError(f"Unsupported report type: {report_type}")

    def _build_dashboard_data(self, db: Session) -> Dict[str, Any]:
        total_candidates = db.query(Candidate).count()
        total_jobs = db.query(Job).count()
        total_applications = db.query(Application).count()
        total_screenings = db.query(ScreeningResult).count()

        return {
            "title": "Dashboard Report",
            "summary": {
                "total_candidates": total_candidates,
                "total_jobs": total_jobs,
                "total_applications": total_applications,
                "total_screenings": total_screenings,
            },
        }

    def _build_candidates_data(self, db: Session) -> Dict[str, Any]:
        candidates = db.query(Candidate).all()

        rows = [
            {
                "id": candidate.id,
                "name": candidate.full_name,
                "email": candidate.email,
                "phone": candidate.phone,
                "location": candidate.location,
                "current_position": candidate.current_position,
                "company": candidate.current_company,
                "created_at": candidate.created_at.isoformat() if candidate.created_at else "",
            }
            for candidate in candidates
        ]

        return {
            "title": "Candidates Report",
            "rows": rows,
        }

    def _build_jobs_data(self, db: Session) -> Dict[str, Any]:
        jobs = db.query(Job).all()

        rows = [
            {
                "id": job.id,
                "title": job.title,
                "department": job.department,
                "location": job.location,
                "status": job.status,
                "posted_at": job.posted_at.isoformat() if job.posted_at else "",
            }
            for job in jobs
        ]

        return {
            "title": "Jobs Report",
            "rows": rows,
        }

    def _build_applications_data(self, db: Session) -> Dict[str, Any]:
        applications = db.query(Application).all()

        rows = [
            {
                "id": application.id,
                "candidate_id": application.candidate_id,
                "job_id": application.job_id,
                "status": application.status,
                "source": application.source,
                "applied_at": application.applied_at.isoformat() if application.applied_at else "",
            }
            for application in applications
        ]

        return {
            "title": "Applications Report",
            "rows": rows,
        }

    def _build_screening_data(self, db: Session) -> Dict[str, Any]:
        screenings = db.query(ScreeningResult).all()

        rows = [
            {
                "id": screening.id,
                "application_id": screening.application_id,
                "overall_score": screening.overall_score,
                "recommendation": screening.recommendation,
                "created_at": screening.created_at.isoformat() if getattr(screening, "created_at", None) else "",
            }
            for screening in screenings
        ]

        return {
            "title": "AI Screening Report",
            "rows": rows,
        }
