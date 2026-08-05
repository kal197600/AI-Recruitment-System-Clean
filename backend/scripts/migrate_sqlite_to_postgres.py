"""One-time migration from local SQLite to PostgreSQL.

Usage:
	python scripts/migrate_sqlite_to_postgres.py

Requirements:
	- DATABASE_URL must point to PostgreSQL.
	- SQLite URL can be provided with SQLITE_DATABASE_URL.
	  If not provided, defaults to sqlite:///./recruitment.db.
"""

from __future__ import annotations

import importlib
import os
import pkgutil
from typing import Any

from dotenv import load_dotenv
from sqlalchemy import create_engine, insert, select
from sqlalchemy.engine import Engine
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import sessionmaker

from app.database.database import Base
import app.models  # noqa: F401  # Ensures all models are registered on Base metadata.


def _import_all_model_modules() -> None:
	"""Import every module under app.models so all tables are registered."""
	package_name = app.models.__name__

	for module_info in pkgutil.iter_modules(app.models.__path__):
		if module_info.ispkg:
			continue

		module_name = f"{package_name}.{module_info.name}"
		importlib.import_module(module_name)


def _sqlite_url() -> str:
	"""Resolve local SQLite URL from environment or default path."""
	return os.getenv("SQLITE_DATABASE_URL", "sqlite:///./recruitment.db")


def _postgres_url() -> str:
	"""Resolve PostgreSQL URL from DATABASE_URL environment variable."""
	database_url = os.getenv("DATABASE_URL")
	if not database_url:
		raise ValueError("DATABASE_URL is not set.")

	if database_url.startswith("sqlite"):
		raise ValueError(
			"DATABASE_URL points to SQLite. Set DATABASE_URL to PostgreSQL for migration."
		)

	return database_url


def _build_engine(url: str) -> Engine:
	"""Create SQLAlchemy engine with SQLite-specific connect args when needed."""
	options: dict[str, Any] = {}
	if url.startswith("sqlite"):
		options["connect_args"] = {"check_same_thread": False}

	return create_engine(url, **options)


def migrate() -> None:
	"""Copy records from SQLite to PostgreSQL for all discovered SQLAlchemy tables."""
	load_dotenv()
	_import_all_model_modules()

	sqlite_url = _sqlite_url()
	postgres_url = _postgres_url()

	sqlite_engine = _build_engine(sqlite_url)
	postgres_engine = _build_engine(postgres_url)

	SQLiteSession = sessionmaker(bind=sqlite_engine, autoflush=False, autocommit=False)
	PostgresSession = sessionmaker(
		bind=postgres_engine,
		autoflush=False,
		autocommit=False,
	)

	source_session = SQLiteSession()
	target_session = PostgresSession()

	print("=" * 80)
	print("Starting SQLite -> PostgreSQL migration")
	print(f"SQLite source: {sqlite_url}")
	print(f"PostgreSQL target: {postgres_url}")
	print("=" * 80)

	try:
		tables = list(Base.metadata.sorted_tables)

		if not tables:
			print("No tables discovered in Base.metadata.sorted_tables. Nothing to migrate.")
			return

		total_inserted = 0
		total_skipped = 0

		for table in tables:
			table_name = table.name
			print(f"\nMigrating table: {table_name}")

			rows = source_session.execute(select(table)).mappings().all()

			if not rows:
				print(f"  - No rows found in {table_name}. Skipping.")
				continue

			inserted_count = 0
			skipped_count = 0

			for row in rows:
				payload = dict(row)
				stmt = insert(table).values(**payload)

				try:
					with target_session.begin_nested():
						target_session.execute(stmt)
					inserted_count += 1
				except IntegrityError:
					skipped_count += 1
				except SQLAlchemyError as exc:
					print(
						f"  - Error inserting row in {table_name}: {exc}. Row skipped."
					)
					skipped_count += 1

			target_session.commit()

			total_inserted += inserted_count
			total_skipped += skipped_count

			print(
				f"  - Completed {table_name}: inserted={inserted_count}, skipped={skipped_count}"
			)

		print("\n" + "=" * 80)
		print("Migration completed")
		print(f"Total inserted: {total_inserted}")
		print(f"Total skipped : {total_skipped}")
		print("=" * 80)

	finally:
		source_session.close()
		target_session.close()
		sqlite_engine.dispose()
		postgres_engine.dispose()


if __name__ == "__main__":
	migrate()
