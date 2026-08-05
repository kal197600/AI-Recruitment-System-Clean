import json
import logging
import os
from types import UnionType
from typing import Any, get_args, get_origin

from dotenv import load_dotenv
from pydantic import BaseModel

from app.ai.llm import ask_llm
from app.ai.prompts import (
    CV_EXTRACTION_PROMPT,
    SCREENING_PROMPT,
    JOB_MATCHING_PROMPT,
)
from app.ai.schemas import (
    CandidateExtraction,
    ScreeningResultAI,
    JobMatchingResponse,
)

load_dotenv()
logger = logging.getLogger(__name__)


class AIService:
    """
    Central AI service for:
      - Resume parsing
      - Candidate screening
      - Job matching

    All LLM communication is delegated to app.ai.llm.ask_llm().
    """

    def __init__(self):
        self.model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

    # ==================================================
    # Internal Helpers
    # ==================================================

    @staticmethod
    def _extract_json(content: str) -> dict:
        """
        Extract JSON from an LLM response.

        Handles:
        - Raw JSON
        - ```json fenced blocks
        """

        text = content.strip()

        if text.startswith("```"):
            lines = text.splitlines()

            if lines and lines[0].startswith("```"):
                lines = lines[1:]

            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]

            text = "\n".join(lines).strip()

        return json.loads(text)

    @staticmethod
    def _unwrap_optional(annotation: Any) -> Any:
        origin = get_origin(annotation)

        if origin in (UnionType,):
            args = [arg for arg in get_args(annotation) if arg is not type(None)]
            if len(args) == 1:
                return args[0]

        if str(origin) == "typing.Union":
            args = [arg for arg in get_args(annotation) if arg is not type(None)]
            if len(args) == 1:
                return args[0]

        return annotation

    @classmethod
    def _is_numeric_annotation(cls, annotation: Any) -> bool:
        unwrapped = cls._unwrap_optional(annotation)
        return unwrapped in (int, float)

    @classmethod
    def _normalize_numeric_payload(
        cls,
        data: Any,
        model_cls: type[BaseModel],
        parent_path: str = "",
    ) -> tuple[Any, list[str]]:
        if not isinstance(data, dict):
            return data, []

        normalized = dict(data)
        changes: list[str] = []

        for field_name, field_info in model_cls.model_fields.items():
            annotation = field_info.annotation
            field_path = f"{parent_path}.{field_name}" if parent_path else field_name

            if cls._is_numeric_annotation(annotation):
                current_value = normalized.get(field_name)
                missing_or_empty = (
                    field_name not in normalized
                    or current_value is None
                    or (isinstance(current_value, str) and current_value.strip() == "")
                )

                if missing_or_empty:
                    normalized[field_name] = 0
                    changes.append(field_path)

                continue

            unwrapped = cls._unwrap_optional(annotation)
            origin = get_origin(unwrapped)

            if isinstance(unwrapped, type) and issubclass(unwrapped, BaseModel):
                nested_value = normalized.get(field_name)
                if isinstance(nested_value, dict):
                    nested_normalized, nested_changes = cls._normalize_numeric_payload(
                        nested_value,
                        unwrapped,
                        parent_path=field_path,
                    )
                    normalized[field_name] = nested_normalized
                    changes.extend(nested_changes)
                continue

            if origin is list:
                args = get_args(unwrapped)
                if not args:
                    continue

                item_annotation = cls._unwrap_optional(args[0])
                list_value = normalized.get(field_name)

                if not isinstance(list_value, list):
                    continue

                updated_items = []
                for index, item in enumerate(list_value):
                    item_path = f"{field_path}[{index}]"

                    if cls._is_numeric_annotation(item_annotation):
                        if item is None or (isinstance(item, str) and item.strip() == ""):
                            updated_items.append(0)
                            changes.append(item_path)
                        else:
                            updated_items.append(item)
                        continue

                    if (
                        isinstance(item_annotation, type)
                        and issubclass(item_annotation, BaseModel)
                        and isinstance(item, dict)
                    ):
                        nested_normalized, nested_changes = cls._normalize_numeric_payload(
                            item,
                            item_annotation,
                            parent_path=item_path,
                        )
                        updated_items.append(nested_normalized)
                        changes.extend(nested_changes)
                        continue

                    updated_items.append(item)

                normalized[field_name] = updated_items

        return normalized, changes

    # ==================================================
    # Resume Parsing
    # ==================================================

    def parse_resume(
        self,
        resume_text: str,
    ) -> CandidateExtraction:
        prompt = f"""{CV_EXTRACTION_PROMPT}

==============================
RESUME
==============================

{resume_text}

Return ONLY valid JSON.
"""

        response = ask_llm(
            prompt=prompt,
            model=self.model,
        )

        data = self._extract_json(response)
        normalized_data, coerced_fields = self._normalize_numeric_payload(
            data,
            CandidateExtraction,
        )

        if coerced_fields:
            logger.warning(
                "Normalized empty/missing numeric AI fields to 0: %s",
                ", ".join(coerced_fields),
            )

        return CandidateExtraction.model_validate(normalized_data)

    # ==================================================
    # Candidate Screening
    # ==================================================

    def screen_candidate(
        self,
        resume_text: str,
        job_description: str,
    ) -> ScreeningResultAI:
        prompt = f"""{SCREENING_PROMPT}

==============================
JOB DESCRIPTION
==============================

{job_description}

==============================
CANDIDATE RESUME
==============================

{resume_text}

Return ONLY valid JSON with the following fields:

overall_score
technical_score
experience_score
education_score
skills_score
recommendation
strengths
weaknesses
missing_skills
reasoning
ai_model
"""

        response = ask_llm(
            prompt=prompt,
            model=self.model,
        )

        data = self._extract_json(response)

        if "ai_model" not in data or not data["ai_model"]:
            data["ai_model"] = self.model

        return ScreeningResultAI.model_validate(data)

    # ==================================================
    # AI Job Matching
    # ==================================================

    def match_candidate_to_jobs(
        self,
        resume_text: str,
        jobs: list[dict],
    ) -> JobMatchingResponse:
        """
        Compare one candidate against multiple jobs.
        """

        jobs_json = json.dumps(
            jobs,
            indent=2,
            ensure_ascii=False,
        )

        prompt = f"""{JOB_MATCHING_PROMPT}

==============================
AVAILABLE JOBS
==============================

{jobs_json}

==============================
CANDIDATE RESUME
==============================

{resume_text}

Return ONLY valid JSON.
"""

        response = ask_llm(
            prompt=prompt,
            model=self.model,
        )

        print("\n" + "=" * 80)
        print("RAW LLM RESPONSE")
        print("=" * 80)
        print(response)
        print("=" * 80 + "\n")

        data = self._extract_json(response)

        print("\n" + "=" * 80)
        print("PARSED JSON")
        print("=" * 80)
        print(json.dumps(data, indent=2, ensure_ascii=False))
        print("=" * 80 + "\n")

        return JobMatchingResponse.model_validate(data)
