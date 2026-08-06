from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


TABLE_NAMES = [
    "candidates",
    "candidate_files",
    "candidate_skills",
    "candidate_languages",
    "candidate_education",
    "candidate_experience",
    "candidate_work_experience",
    "candidate_certifications",
]


def _resync_table_sequence_sql(table_name: str) -> str:
    return f"""
    DO $$
    DECLARE
        seq_name text;
    BEGIN
        IF to_regclass('{table_name}') IS NOT NULL THEN
            seq_name := pg_get_serial_sequence('{table_name}', 'id');

            IF seq_name IS NOT NULL THEN
                PERFORM setval(
                    seq_name,
                    COALESCE((SELECT MAX(id) FROM {table_name}), 1)
                );
            END IF;
        END IF;
    END
    $$;
    """


@router.post("/resync-sequences")
def resync_sequences(db: Session = Depends(get_db)):
    for table_name in TABLE_NAMES:
        db.execute(text(_resync_table_sequence_sql(table_name)))

    db.commit()

    return {
        "success": True,
    }


@router.post("/fix-job-matches-sequence")
def fix_job_matches_sequence(db: Session = Depends(get_db)):
    try:
        db.execute(
            text(
                """
                SELECT setval(
                    pg_get_serial_sequence('job_matches', 'id'),
                    COALESCE((SELECT MAX(id) FROM job_matches), 1),
                    true
                );
                """
            )
        )
        db.commit()

        return {
            "success": True,
            "message": "Job matches sequence fixed.",
        }
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fix job matches sequence: {exc}",
        )