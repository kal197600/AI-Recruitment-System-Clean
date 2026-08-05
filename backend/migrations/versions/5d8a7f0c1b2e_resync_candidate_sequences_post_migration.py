"""Resync candidate-related PostgreSQL sequences after SQLite import

Revision ID: 5d8a7f0c1b2e
Revises: 2fae6faf7492
Create Date: 2026-08-05 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "5d8a7f0c1b2e"
down_revision: Union[str, Sequence[str], None] = "2fae6faf7492"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _resync_table_sequence(table_name: str) -> None:
    # Keep the same sequence reset pattern requested by the user.
    # Skip tables that are not present in the current schema.
    op.execute(
        f"""
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
    )


def upgrade() -> None:
    """Resync sequences for candidate-related auto-increment tables."""
    table_names = [
        "candidates",
        "candidate_files",
        "candidate_skills",
        "candidate_languages",
        "candidate_education",
        "candidate_experience",
        "candidate_work_experience",
        "candidate_certifications",
    ]

    for table_name in table_names:
        _resync_table_sequence(table_name)


def downgrade() -> None:
    """No-op downgrade; sequence synchronization is data-state maintenance."""
    pass
