from __future__ import annotations

import logging

from apscheduler.triggers.interval import IntervalTrigger

from app.scheduler.email_jobs import run_email_import
from app.scheduler.scheduler import get_scheduler, start_scheduler

logger = logging.getLogger(__name__)

JOB_ID = "scheduled_email_import"


def initialize_scheduler() -> None:
    """
    Register all scheduled jobs and start the scheduler.
    Safe to call multiple times.
    """
    scheduler = get_scheduler()

    if scheduler.get_job(JOB_ID) is None:
        print("Adding Scheduled Email Import job")
        scheduler.add_job(
            func=run_email_import,
            trigger=IntervalTrigger(minutes=1),
            id=JOB_ID,
            name="Scheduled Email Import",
            replace_existing=True,
        )
        job = scheduler.get_job(JOB_ID)
        print("Job:", job)
        print("Jobs after add:", scheduler.get_jobs())

        print("Email import job registered.")

    print("Calling start_scheduler()")
    start_scheduler()
    job = scheduler.get_job(JOB_ID)
    scheduler = get_scheduler()
    print("Jobs after start:", scheduler.get_jobs())
    print("Running after start:", scheduler.running)
    print("Returned from start_scheduler()")