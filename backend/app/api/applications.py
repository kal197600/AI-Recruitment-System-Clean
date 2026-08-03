from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models import (
    Application,
    Candidate,
    CandidateFile,
    Job,
    ScreeningResult,
)
from app.schemas.application import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/",
    response_model=List[ApplicationResponse],
)
def get_applications(
    db: Session = Depends(get_db),
):
    applications = (
        db.query(Application)
        .order_by(Application.id.desc())
        .all()
    )

    result = []

    for application in applications:
        candidate = (
            db.query(Candidate)
            .filter(Candidate.id == application.candidate_id)
            .first()
        )

        job = (
            db.query(Job)
            .filter(Job.id == application.job_id)
            .first()
        )

        screening = (
            db.query(ScreeningResult)
            .filter(ScreeningResult.application_id == application.id)
            .order_by(ScreeningResult.created_at.desc())
            .first()
        )

        result.append(
            {
                "id": application.id,
                "candidate_id": application.candidate_id,
                "job_id": application.job_id,
                "candidate_file_id": application.candidate_file_id,
                "status": application.status,
                "source": application.source,
                "notes": application.notes,
                "applied_at": application.applied_at,
                "updated_at": application.updated_at,
                "candidate_name": candidate.full_name if candidate else "",
                "job_title": job.title if job else "",
                "screening": (
                    {
                        "overall_score": screening.overall_score,
                        "recommendation": screening.recommendation,
                        "technical_score": screening.technical_score,
                        "experience_score": screening.experience_score,
                        "education_score": screening.education_score,
                        "skills_score": screening.skills_score,
                        "ai_model": screening.ai_model,
                        "created_at": screening.created_at,
                    }
                    if screening
                    else None
                ),
            }
        )

    return result


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    return application


@router.post(
    "/",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == data.candidate_id)
        .first()
    )

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found",
        )

    job = (
        db.query(Job)
        .filter(Job.id == data.job_id)
        .first()
    )

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    candidate_file = (
        db.query(CandidateFile)
        .filter(
            CandidateFile.candidate_id == data.candidate_id
        )
        .order_by(CandidateFile.id.desc())
        .first()
    )

    if candidate_file is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate has no uploaded CV.",
        )

    application = Application(
        candidate_id=data.candidate_id,
        job_id=data.job_id,
        candidate_file_id=candidate_file.id,
        status=data.status,
        notes=data.notes,
    )

    try:
        db.add(application)
        db.commit()
        db.refresh(application)
        return application

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to create application.",
        )


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application(
    application_id: int,
    data: ApplicationUpdate,
    db: Session = Depends(get_db),
):
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    update_data = data.model_dump(exclude_unset=True)

    if "candidate_id" in update_data:
        candidate = (
            db.query(Candidate)
            .filter(
                Candidate.id == update_data["candidate_id"]
            )
            .first()
        )

        if candidate is None:
            raise HTTPException(
                status_code=404,
                detail="Candidate not found",
            )

        latest_file = (
            db.query(CandidateFile)
            .filter(
                CandidateFile.candidate_id
                == update_data["candidate_id"]
            )
            .order_by(CandidateFile.id.desc())
            .first()
        )

        if latest_file:
            application.candidate_file_id = latest_file.id

    if "job_id" in update_data:
        job = (
            db.query(Job)
            .filter(Job.id == update_data["job_id"])
            .first()
        )

        if job is None:
            raise HTTPException(
                status_code=404,
                detail="Job not found",
            )

    try:
        for key, value in update_data.items():
            setattr(application, key, value)

        db.commit()
        db.refresh(application)

        return application

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to update application.",
        )


@router.delete(
    "/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
):
    application = (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    try:
        db.delete(application)
        db.commit()

        return Response(
            status_code=status.HTTP_204_NO_CONTENT
        )

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to delete application.",
        )