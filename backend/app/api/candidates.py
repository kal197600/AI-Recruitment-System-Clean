from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models import Candidate
from app.schemas.candidate import (
    CandidateCreate,
    CandidateUpdate,
    CandidateResponse,
)

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/",
    response_model=List[CandidateResponse],
    status_code=status.HTTP_200_OK,
)
def get_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).order_by(Candidate.id.desc()).all()

    response_items: List[CandidateResponse] = []

    ApplicationModel = Candidate.applications.property.mapper.class_
    ScreeningResultModel = ApplicationModel.screening_results.property.mapper.class_

    for candidate in candidates:
        latest_application = (
            db.query(ApplicationModel)
            .filter(ApplicationModel.candidate_id == candidate.id)
            .order_by(ApplicationModel.applied_at.desc(), ApplicationModel.id.desc())
            .first()
        )

        screening_result = None
        if latest_application is not None:
            screening_result = (
                db.query(ScreeningResultModel)
                .filter(ScreeningResultModel.application_id == latest_application.id)
                .first()
            )

        if screening_result is not None:
            screening_status = "Screened"
            overall_score = screening_result.overall_score
            recommendation = screening_result.recommendation
            screening_date = screening_result.created_at
        else:
            screening_status = "Not Screened"
            overall_score = None
            recommendation = None
            screening_date = None

        response_items.append(
            CandidateResponse(
                id=candidate.id,
                full_name=candidate.full_name,
                email=candidate.email,
                phone=candidate.phone,
                location=candidate.location,
                years_experience=candidate.years_experience,
                current_position=candidate.current_position,
                current_company=candidate.current_company,
                original_summary=candidate.original_summary,
                ai_summary=candidate.ai_summary,
                linkedin=candidate.linkedin,
                source=candidate.source,
                ai_model=candidate.ai_model,
                screening_status=screening_status,
                overall_score=overall_score,
                recommendation=recommendation,
                screening_date=screening_date,
            )
        )

    return response_items


@router.get(
    "/{candidate_id}",
    response_model=CandidateResponse,
    status_code=status.HTTP_200_OK,
)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    return candidate


@router.post(
    "/",
    response_model=CandidateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_candidate(
    candidate_data: CandidateCreate,
    db: Session = Depends(get_db),
):
    if getattr(candidate_data, "email", None):
        existing = (
            db.query(Candidate)
            .filter(Candidate.email == candidate_data.email)
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A candidate with this email already exists.",
            )

    candidate = Candidate(**candidate_data.model_dump())

    try:
        db.add(candidate)
        db.commit()
        db.refresh(candidate)
        return candidate

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A candidate with this email already exists.",
        )

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create candidate.",
        )


@router.put(
    "/{candidate_id}",
    response_model=CandidateResponse,
    status_code=status.HTTP_200_OK,
)
def update_candidate(
    candidate_id: int,
    candidate_data: CandidateUpdate,
    db: Session = Depends(get_db),
):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    update_data = candidate_data.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        existing = (
            db.query(Candidate)
            .filter(
                Candidate.email == update_data["email"],
                Candidate.id != candidate_id,
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A candidate with this email already exists.",
            )

    try:
        for field, value in update_data.items():
            setattr(candidate, field, value)

        db.commit()
        db.refresh(candidate)

        return candidate

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A candidate with this email already exists.",
        )

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update candidate.",
        )


@router.delete(
    "/{candidate_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if candidate is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate not found",
        )

    try:
        db.delete(candidate)
        db.commit()

        return Response(status_code=status.HTTP_204_NO_CONTENT)

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete candidate.",
        )