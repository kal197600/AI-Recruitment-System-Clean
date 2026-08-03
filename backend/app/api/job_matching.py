from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.job_matching_service import JobMatchingService

router = APIRouter(
    prefix="/job-matching",
    tags=["AI Job Matching"],
)


@router.post("/run/{candidate_id}")
def run_job_matching(
    candidate_id: int,
    db: Session = Depends(get_db),
):
    """
    Run AI job matching for a candidate.

    Workflow:
    1. Load latest resume
    2. Compare against all open jobs
    3. Save AI scores
    4. Return best match
    """

    service = JobMatchingService(db)

    try:
        result = service.run_matching(candidate_id)

        return {
            "success": True,
            "message": "AI recruitment workflow completed successfully.",
            "candidate_id": candidate_id,
            "best_job_id": result["best_job_id"],
            "application_id": result["application"].id if result["application"] is not None else None,
            "screening_id": result["screening"].id if result["screening"] is not None else None,
            "matches": result["matches"],
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )