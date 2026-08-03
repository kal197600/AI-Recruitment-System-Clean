import json
import os

from dotenv import load_dotenv

from app.ai.llm import ask_llm
from app.ai.prompts import (
    CV_EXTRACTION_PROMPT,
    SCREENING_PROMPT,
<<<<<<< HEAD
    JOB_MATCHING_PROMPT,
=======
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656
)
from app.ai.schemas import (
    CandidateExtraction,
    ScreeningResultAI,
<<<<<<< HEAD
    JobMatchingResponse,
=======
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656
)

load_dotenv()


class AIService:
    """
    Central AI service for:
      - Resume parsing
      - Candidate screening
<<<<<<< HEAD
      - Job matching
=======
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656

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

    # ==================================================
    # Resume Parsing
    # ==================================================

    def parse_resume(
        self,
        resume_text: str,
    ) -> CandidateExtraction:
<<<<<<< HEAD

=======
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656
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

<<<<<<< HEAD
        # ==================================================
        # DEBUG - Print raw LLM response
        # ==================================================
        print("\n" + "=" * 80)
        print("RAW LLM RESPONSE")
        print("=" * 80)
        print(response)
        print("=" * 80 + "\n")

        data = self._extract_json(response)

        # ==================================================
        # DEBUG - Print parsed JSON
        # ==================================================
        print("\n" + "=" * 80)
        print("PARSED JSON")
        print("=" * 80)
        print(json.dumps(data, indent=2, ensure_ascii=False))
        print("=" * 80 + "\n")

=======
        data = self._extract_json(response)

>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656
        return CandidateExtraction.model_validate(data)

    # ==================================================
    # Candidate Screening
    # ==================================================

    def screen_candidate(
        self,
        resume_text: str,
        job_description: str,
    ) -> ScreeningResultAI:
<<<<<<< HEAD

=======
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656
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

<<<<<<< HEAD
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
=======
        return ScreeningResultAI.model_validate(data)
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656
