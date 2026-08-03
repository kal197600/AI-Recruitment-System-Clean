from fastapi import APIRouter, UploadFile, File
import os
import shutil

from app.ai.cv_parser import CVParser

router = APIRouter(
    prefix="/screening",
    tags=["Screening"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    parser = CVParser()

    candidate = parser.parse(file_path)

    return candidate.model_dump()