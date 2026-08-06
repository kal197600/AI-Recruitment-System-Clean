import json
from pathlib import Path, PureWindowsPath
from typing import Any

from sqlalchemy.orm import Session

from app.ai.ai_service import AIService
from app.models import (
    Application,
    CandidateFile,
    Job,
    ScreeningResult,
)
from app.parsers.pdf_parser import PDFParser
from app.parsers.docx_parser import DOCXParser


class ScreeningService:
    """
    Executes the complete AI screening workflow.

    Workflow:
        1. Load application
        2. Load job
        3. Load candidate CV
        4. Extract resume text
        5. Run AI screening
        6. Save or update ScreeningResult
    """

    def __init__(self):
        self.ai_service = AIService()
        self.pdf_parser = PDFParser()
        self.docx_parser = DOCXParser()

    @staticmethod
    def _to_dict(result: Any) -> dict:
        """
        Normalize AI response into a dictionary.
        Supports:
            - Pydantic v2 models
            - Dictionaries
            - JSON strings
            - Generic objects
        """
        if result is None:
            return {}

        if isinstance(result, dict):
            return result

        if isinstance(result, str):
            try:
                return json.loads(result)
            except Exception:
                return {}

        if hasattr(result, "model_dump"):
            return result.model_dump()

        if hasattr(result, "dict"):
            return result.dict()

        if hasattr(result, "__dict__"):
            return vars(result)

        return {}

    @staticmethod
    def _normalize_text(value: Any) -> str:
        if value is None:
            return ""

        if isinstance(value, list):
            return "\n".join(str(v) for v in value)

        return str(value)

    @staticmethod
    def _normalize_score(value: Any) -> int:
        try:
            score = int(round(float(value)))
            return max(0, min(100, score))
        except Exception:
            return 0

    def run_screening(
        self,
        db: Session,
        application_id: int,
    ) -> ScreeningResult:
        # --------------------------------------------------
        # Load application
        # --------------------------------------------------
        application = (
            db.query(Application)
            .filter(Application.id == application_id)
            .first()
        )

        if application is None:
            raise ValueError("Application not found.")

        # --------------------------------------------------
        # Load job
        # --------------------------------------------------
        job = (
            db.query(Job)
            .filter(Job.id == application.job_id)
            .first()
        )

        if job is None:
            raise ValueError("Job not found.")

        # --------------------------------------------------
        # Load candidate CV
        # --------------------------------------------------
        candidate_file = (
            db.query(CandidateFile)
            .filter(CandidateFile.id == application.candidate_file_id)
            .first()
        )

        if candidate_file is None:
            raise ValueError("Candidate CV not found.")

        # --------------------------------------------------
        # Extract resume text (PDF / DOCX)
        # --------------------------------------------------
        raw_path = str(candidate_file.filepath or "").strip()

        is_remote_path = raw_path.startswith(("http://", "https://"))

        if is_remote_path:
            resolved_path = raw_path
            extension = raw_path.lower()
        else:
            normalized_path = Path(PureWindowsPath(raw_path))

            if not normalized_path.is_absolute():
                base_dir = Path(__file__).resolve().parents[2]
                normalized_path = base_dir / normalized_path

            if not normalized_path.exists():
                raise ValueError(
                    f"Candidate CV file not found: {normalized_path}"
                )

            resolved_path = str(normalized_path)
            extension = normalized_path.suffix.lower()

        if extension.endswith(".pdf"):

            resume_text = self.pdf_parser.extract_text(
                resolved_path
            )

        elif extension.endswith(".docx"):

            resume_text = self.docx_parser.extract_text(
                resolved_path
            )

        else:

            raise ValueError(
                f"Unsupported resume format: {extension}"
            )

        if not resume_text.strip():
            raise ValueError(
                "Unable to extract text from the candidate CV."
            )

        # --------------------------------------------------
        # Run AI screening
        # --------------------------------------------------
        ai_result = self.ai_service.screen_candidate(
            resume_text=resume_text,
            job_description=job.description or "",
        )

        data = self._to_dict(ai_result)

        # --------------------------------------------------
        # Load existing screening result
        # --------------------------------------------------
        screening = (
            db.query(ScreeningResult)
            .filter(ScreeningResult.application_id == application.id)
            .first()
        )

        if screening is None:
            screening = ScreeningResult(
                application_id=application.id,
            )
            db.add(screening)

        # --------------------------------------------------
        # Update fields
        # --------------------------------------------------
        screening.overall_score = self._normalize_score(
            data.get("overall_score")
        )
        screening.technical_score = self._normalize_score(
            data.get("technical_score")
        )
        screening.experience_score = self._normalize_score(
            data.get("experience_score")
        )
        screening.education_score = self._normalize_score(
            data.get("education_score")
        )
        screening.skills_score = self._normalize_score(
            data.get("skills_score")
        )

        screening.recommendation = self._normalize_text(
            data.get("recommendation")
        )
        screening.strengths = self._normalize_text(
            data.get("strengths")
        )
        screening.weaknesses = self._normalize_text(
            data.get("weaknesses")
        )
        screening.missing_skills = self._normalize_text(
            data.get("missing_skills")
        )
        screening.reasoning = self._normalize_text(
            data.get("reasoning")
        )
        screening.ai_model = self._normalize_text(
            data.get("ai_model", self.ai_service.model)
        )

        # --------------------------------------------------
        # Save
        # --------------------------------------------------
        db.commit()
        db.refresh(screening)

        return screening