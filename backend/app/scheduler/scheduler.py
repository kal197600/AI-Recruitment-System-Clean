from __future__ import annotations

import logging
from zoneinfo import ZoneInfo

from apscheduler.executors.pool import ThreadPoolExecutor
from apscheduler.schedulers.background import BackgroundScheduler

logger = logging.getLogger(__name__)

_scheduler: BackgroundScheduler | None = None


def get_scheduler() -> BackgroundScheduler:
    global _scheduler

    if _scheduler is None:
        _scheduler = BackgroundScheduler(
            timezone=ZoneInfo("UTC"),
            executors={
                "default": ThreadPoolExecutor(max_workers=5),
            },
            job_defaults={
                "coalesce": True,
                "max_instances": 1,
                "misfire_grace_time": 300,
            },
        )

    return _scheduler


def start_scheduler() -> None:
    scheduler = get_scheduler()

    if scheduler.running:
        return

    scheduler.start()
    logger.info("Scheduler started.")


def shutdown_scheduler() -> None:
    global _scheduler

    if _scheduler is None:
        return

    if not _scheduler.running:
        return

    _scheduler.shutdown(wait=True)
    logger.info("Scheduler stopped.")

    _scheduler = None


__all__ = [
    "get_scheduler",
    "start_scheduler",
    "shutdown_scheduler",
]