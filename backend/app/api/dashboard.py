from collections import OrderedDict
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.database.database import get_db
from app.models import Application, Candidate, Job, ScreeningResult

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


def build_monthly_application_counts(applications):
    counts = OrderedDict()

    for (applied_at,) in applications:
        if applied_at is None:
            continue

        key = applied_at.strftime("%b %Y")

        counts[key] = counts.get(key, 0) + 1

    return [
        {"month": month, "count": count}
        for month, count in counts.items()
    ]


def build_recent_candidates(candidates):
    rows = []

    for candidate in candidates:
        latest_application = None
        latest_screening = None

        if candidate.applications:
            latest_application = max(
                candidate.applications,
                key=lambda app: app.applied_at or datetime.min,
            )

            if latest_application.screening_results:
                latest_screening = max(
                    latest_application.screening_results,
                    key=lambda screen: screen.created_at or datetime.min,
                )

        rows.append(
            {
                "id": candidate.id,
                "name": candidate.full_name,
                "position": candidate.current_position
                or candidate.current_company
                or "",
                "score": int(round(latest_screening.overall_score))
                if latest_screening and latest_screening.overall_score is not None
                else None,
                "status": latest_application.status
                if latest_application
                else candidate.source or "",
            }
        )

    return rows


def build_recent_jobs(jobs):
    rows = []

    for job in jobs:
        rows.append(
            {
                "id": job.id,
                "title": job.title,
                "department": job.department or "",
                "applicants": len(job.applications)
                if job.applications
                else 0,
                "status": job.status or "",
            }
        )

    return rows


@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):
    total_candidates = db.query(Candidate).count()
    total_jobs = db.query(Job).count()
    total_applications = db.query(Application).count()
    total_screenings = db.query(ScreeningResult).count()

    average_score_value = (
        db.query(func.avg(ScreeningResult.overall_score)).scalar() or 0
    )

    average_ai_score = round(float(average_score_value), 0)

    applications = (
        db.query(Application.applied_at)
        .order_by(Application.applied_at.asc())
        .all()
    )

    monthly_applications = build_monthly_application_counts(applications)

    recent_candidates = (
        db.query(Candidate)
        .options(
            selectinload(Candidate.applications).selectinload(
                Application.screening_results
            )
        )
        .order_by(Candidate.created_at.desc())
        .limit(5)
        .all()
    )

    recent_jobs = (
        db.query(Job)
        .options(selectinload(Job.applications))
        .order_by(Job.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "statistics": {
            "total_candidates": total_candidates,
            "total_jobs": total_jobs,
            "total_applications": total_applications,
            "total_screenings": total_screenings,
            "average_ai_score": average_ai_score,
        },
        "recommendations": {
            "summary": (
                "No application data available."
                if total_applications == 0
                else (
                    "AI screening performance is strong."
                    if average_ai_score >= 80
                    else (
                        "Candidate quality is moderate; prioritize interviews."
                        if average_ai_score >= 60
                        else "Review candidate sourcing and screening criteria."
                    )
                )
            ),
            "insight": (
                "Some applications are not screened yet."
                if total_screenings < total_applications
                else "All applications have screening records."
            ),
        },
        "monthly_applications": monthly_applications,
        "recent_candidates": build_recent_candidates(recent_candidates),
        "recent_jobs": build_recent_jobs(recent_jobs),
    }
