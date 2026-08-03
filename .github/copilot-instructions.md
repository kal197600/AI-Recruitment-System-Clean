# AI Recruitment System – Copilot Instructions

## Overview

This repository contains a production-grade AI Recruitment System.

The goal is to maintain a clean, scalable and production-ready architecture.

Copilot must behave like a senior software engineer.

Do not generate tutorial code.

Do not generate demo code.

Do not generate placeholders unless explicitly requested.

Every implementation must integrate with the existing architecture.

---

# Tech Stack

Backend

- FastAPI
- SQLAlchemy ORM
- SQLite
- Pydantic v2

Frontend

- React 18
- Vite
- Material UI (MUI)
- Axios
- React Router

Version Control

- Git
- GitHub

---

# General Rules

Before writing code:

1. Analyze the project.
2. Find existing implementations.
3. Reuse existing code.
4. Modify only what is required.

Never rewrite an entire module if a small modification is enough.

Never duplicate functionality.

Never create a second implementation of an existing feature.

---

# Backend Standards

Always reuse:

- existing models
- existing schemas
- existing services
- existing dependencies

Keep REST endpoints consistent.

Return proper HTTP status codes.

Always validate request bodies.

Never bypass SQLAlchemy ORM.

Always use dependency injection.

Example:

Depends(get_db)

Do not hardcode paths.

Do not hardcode configuration.

Read environment variables whenever appropriate.

---

# SQLAlchemy

Reuse existing models.

Prefer joins over multiple unnecessary queries.

Avoid N+1 queries.

Commit only when required.

Rollback on failure.

Close sessions properly.

Never duplicate models.

---

# FastAPI

Use APIRouter.

Keep routes grouped logically.

Examples:

/candidates

/jobs

/applications

/screening

/dashboard

/reports

/auth

---

# Error Handling

Always return meaningful errors.

Never expose stack traces.

Use:

HTTPException

Use appropriate HTTP status codes.

---

# API Design

Prefer:

GET

POST

PUT

DELETE

Do not invent endpoint naming.

Keep naming consistent.

---

# Frontend Standards

Never recreate pages.

Modify existing pages.

Reuse components.

Reuse services.

Reuse dialogs.

Reuse tables.

Keep Material UI styling consistent.

---

# React

Prefer functional components.

Use hooks.

Keep state minimal.

Avoid duplicated state.

Use memoization only when beneficial.

---

# Material UI

Maintain the existing design language.

Use:

Card

Paper

Grid

Stack

Typography

DataGrid (if already used)

Dialog

Snackbar

Skeleton

Do not introduce another UI framework.

---

# Axios

Reuse the existing api instance.

Do not create duplicate Axios clients.

Keep service files separated.

Example:

candidateService.js

jobService.js

applicationService.js

dashboardService.js

---

# Dashboard

Dashboard must contain live data.

Never hardcode statistics.

Statistics should come from backend APIs.

Dashboard cards should include:

Total Candidates

Total Jobs

Total Applications

Total Screenings

Average AI Score

Recommendation Distribution

Recent Candidates

Recent Jobs

Charts must consume backend data.

---

# AI Screening

Never duplicate screening logic.

Reuse existing screening endpoints.

Display:

score

recommendation

summary

skills

strengths

weaknesses

Always preserve screening history.

---

# Reports

Support:

PDF

Excel

Reports should reuse backend data.

Do not duplicate queries.

---

# Authentication

Reuse JWT authentication.

Protect private routes.

Implement role-based access if available.

Never expose sensitive information.

---

# Deployment

Keep Docker compatible.

Keep environment variables external.

Never hardcode secrets.

---

# Code Quality

Keep functions short.

Keep components reusable.

Avoid deeply nested logic.

Extract reusable code.

Avoid duplicated code.

---

# Performance

Avoid unnecessary rerenders.

Avoid unnecessary database queries.

Use pagination when appropriate.

Lazy load heavy components.

---

# Naming

Follow existing naming conventions.

Do not rename files unnecessarily.

Do not rename endpoints unnecessarily.

---

# Git

Small commits.

One feature per commit.

Never modify unrelated files.

---

# Workflow

Before implementing a feature:

1. Analyze the project.

2. Identify affected files.

3. Explain the implementation plan.

4. Implement.

5. Verify consistency.

6. Ensure project still compiles.

---

# Preferred Response Format

Whenever asked to implement something:

First list:

Affected files

Reason for each modification

Implementation strategy

Only then modify the files.

---

# Important

Do NOT invent APIs.

Do NOT invent models.

Do NOT invent schemas.

Reuse existing architecture whenever possible.

Production quality is always preferred over speed.