from app.ai.cv_parser import CVParser
from app.database.database import SessionLocal
from app.services.candidate_service import CandidateService


PDF_PATH = "uploads/2026/07/90e67ff8218148d9af34c7ad13fdcd16.pdf"


def main():

    print("=" * 70)
    print("Parsing Resume...")
    print("=" * 70)

    parser = CVParser()

    candidate_data = parser.parse(PDF_PATH)

    print(candidate_data.model_dump_json(indent=2))

    print("\nSaving to database...")

    db = SessionLocal()

    try:

        service = CandidateService(db)

        candidate = service.save_ai_candidate(candidate_data)

        print("\nSUCCESS!")
        print("-" * 70)
        print(f"Candidate ID : {candidate.id}")
        print(f"Name         : {candidate.full_name}")
        print(f"Email        : {candidate.email}")

    finally:
        db.close()


if __name__ == "__main__":
    main()