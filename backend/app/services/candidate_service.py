from sqlalchemy.orm import Session

from app.models import (
    Candidate,
    CandidateSkill,
    CandidateEducation,
    CandidateExperience,
    CandidateLanguage,
    CandidateCertification
)


class CandidateService:

    def __init__(self, db: Session):
        self.db = db

    # ==========================================================
    # PUBLIC
    # ==========================================================

    def save_ai_candidate(self, data):

        candidate = self._find_candidate(data)

        if candidate is None:
            candidate = self._create_candidate(data)
        else:
            candidate = self._update_candidate(candidate, data)

        self._replace_skills(candidate, data.skills)
        self._replace_education(candidate, data.education)
        self._replace_experience(candidate, data.work_experience)
        self._replace_languages(candidate, data.languages)
        self._replace_certifications(candidate, data.certifications)

        self.db.commit()
        self.db.refresh(candidate)

        return candidate

    # ==========================================================
    # Candidate
    # ==========================================================

    def _find_candidate(self, data):

        if data.email:

            candidate = (
                self.db.query(Candidate)
                .filter(Candidate.email == data.email)
                .first()
            )

            if candidate:
                return candidate

        if data.phone:

            candidate = (
                self.db.query(Candidate)
                .filter(Candidate.phone == data.phone)
                .first()
            )

            if candidate:
                return candidate

        return None

    def _create_candidate(self, data):

        candidate = Candidate(

            full_name=data.full_name,

            email=data.email,

            phone=data.phone,

            location=data.location,

            linkedin=data.linkedin,

            years_experience=data.years_experience,

            current_position=data.current_position,

            current_company=data.current_company,

            original_summary=data.original_summary,

            ai_summary=data.ai_summary,

            source="Email",

            ai_model="gpt-5"

        )

        self.db.add(candidate)

        self.db.flush()

        return candidate

    def _update_candidate(self, candidate, data):

        candidate.full_name = data.full_name
        candidate.phone = data.phone
        candidate.location = data.location
        candidate.linkedin = data.linkedin
        candidate.years_experience = data.years_experience
        candidate.current_position = data.current_position
        candidate.current_company = data.current_company
        candidate.original_summary = data.original_summary
        candidate.ai_summary = data.ai_summary

        return candidate

    # ==========================================================
    # Skills
    # ==========================================================

    def _replace_skills(self, candidate, skills):

        self.db.query(CandidateSkill).filter(
            CandidateSkill.candidate_id == candidate.id
        ).delete()

        for skill in skills:

            self.db.add(
                CandidateSkill(
                    candidate_id=candidate.id,
                    skill=skill
                )
            )

    # ==========================================================
    # Education
    # ==========================================================

    def _replace_education(self, candidate, education):

        self.db.query(CandidateEducation).filter(
            CandidateEducation.candidate_id == candidate.id
        ).delete()

        for item in education:

            self.db.add(

                CandidateEducation(

                    candidate_id=candidate.id,

                    degree=item.degree,

                    institution=item.institution,

                    field=item.field,

                    start_date=item.start_date,

                    end_date=item.end_date

                )

            )

    # ==========================================================
    # Experience
    # ==========================================================

    def _replace_experience(self, candidate, experience):

        self.db.query(CandidateExperience).filter(
            CandidateExperience.candidate_id == candidate.id
        ).delete()

        for item in experience:

            self.db.add(

                CandidateExperience(

                    candidate_id=candidate.id,

                    position=item.position,

                    company=item.company,

                    start_date=item.start_date,

                    end_date=item.end_date,

                    description=item.description

                )

            )

    # ==========================================================
    # Languages
    # ==========================================================

    def _replace_languages(self, candidate, languages):

        self.db.query(CandidateLanguage).filter(
            CandidateLanguage.candidate_id == candidate.id
        ).delete()

        for item in languages:

            self.db.add(

                CandidateLanguage(

                    candidate_id=candidate.id,

                    language=item.language,

                    level=item.level

                )

            )

    # ==========================================================
    # Certifications
    # ==========================================================

    def _replace_certifications(self, candidate, certifications):

        self.db.query(CandidateCertification).filter(
            CandidateCertification.candidate_id == candidate.id
        ).delete()

        for item in certifications:

            self.db.add(

                CandidateCertification(

                    candidate_id=candidate.id,

                    certificate=item.certificate,

                    issuer=item.issuer,

                    issue_date=item.issue_date

                )

            )