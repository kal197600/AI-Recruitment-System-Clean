from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models import Candidate
from app.services.storage_service import StorageService
from app.services.candidate_file_service import CandidateFileService

router = APIRouter(
    prefix="/candidate-files",
    tags=["Candidate Files"],
)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
}


@router.post(
    "/upload/{candidate_id}",
    status_code=status.HTTP_201_CREATED,
)
async def upload_candidate_cv(
    candidate_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found.",
        )

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC and DOCX files are allowed.",
        )

    payload = await file.read()

    attachment = {
        "filename": file.filename,
        "payload": payload,
    }

    storage = StorageService()

    storage_result = storage.save_attachment(
        attachment
    )

    candidate_file = CandidateFileService(
        db
    ).create_file(
        candidate,
        storage_result,
        file_type="CV",
    )

    db.commit()
    db.refresh(candidate_file)

    return {
        "message": "CV uploaded successfully.",
        "id": candidate_file.id,
        "candidate_id": candidate.id,
        "filename": candidate_file.original_filename,
        "filepath": candidate_file.filepath,
    }