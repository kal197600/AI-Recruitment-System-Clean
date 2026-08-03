from sqlalchemy.orm import Session

from app.models import CandidateFile


class CandidateFileService:

    def __init__(self, db: Session):
        self.db = db

    # --------------------------------------------------

    def create_file(
        self,
        candidate,
        storage_result,
        file_type="CV"
    ):

        candidate_file = CandidateFile(

            candidate_id=candidate.id,

            original_filename=storage_result["original_filename"],

            stored_filename=storage_result["stored_filename"],

            filepath=storage_result["filepath"],

            file_type=file_type,

            file_size=storage_result["size"]

        )

        self.db.add(candidate_file)

        self.db.flush()

        return candidate_file