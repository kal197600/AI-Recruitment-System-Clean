from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import traceback

from app.database import get_db
from app.services.screening_service import ScreeningService

router = APIRouter(
    prefix="/screening",
    tags=["AI Screening"],
)


@router.post("/run/{application_id}")
def run_screening(
    application_id: int,
    db: Session = Depends(get_db),
):
    """
    Execute AI screening for a job application.
    """
    try:
        service = ScreeningService()

        screening = service.run_screening(
            db=db,
            application_id=application_id,
        )

        return {
            "success": True,
            "message": "AI screening completed successfully.",
            "data": {
                "id": screening.id,
                "application_id": screening.application_id,
                "overall_score": screening.overall_score,
                "technical_score": screening.technical_score,
                "experience_score": screening.experience_score,
                "education_score": screening.education_score,
                "skills_score": screening.skills_score,
                "recommendation": screening.recommendation,
                "strengths": screening.strengths,
                "weaknesses": screening.weaknesses,
                "missing_skills": screening.missing_skills,
                "reasoning": screening.reasoning,
                "ai_model": screening.ai_model,
                "created_at": screening.created_at,
            },
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

    except Exception as exc:
        print("\n" + "=" * 80)
        print("AI SCREENING ERROR")
        print("=" * 80)
        traceback.print_exc()
        print(f"\nException type: {type(exc).__name__}")
        print(f"Exception message: {exc}")
        print("=" * 80 + "\n")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
