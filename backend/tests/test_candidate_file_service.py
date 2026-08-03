from app.database.database import SessionLocal
from app.services.candidate_file_service import CandidateFileService
from app.models import Candidate


db = SessionLocal()

candidate = db.query(Candidate).first()

storage_result = {

    "original_filename": "Mariana Hallal CV.pdf",

    "stored_filename": "abc123.pdf",

    "filepath": "uploads/2026/07/abc123.pdf",

    "size": 417288

}

service = CandidateFileService(db)

candidate_file = service.create_file(
    candidate,
    storage_result
)

db.commit()

print(candidate_file.id)
print(candidate_file.filepath)

db.close()