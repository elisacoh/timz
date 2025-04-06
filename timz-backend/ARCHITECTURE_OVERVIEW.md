# Backend Architecture Summary

## Overview

This document describes the architectural structure of the Timz backend. The project follows a modular and layered FastAPI architecture designed for long-term scalability and ease of testing.

## Folder Structure

<pre>app/
├── api/v1/ # Route entry points per domain (auth, bookings, etc.) 
├── core/ # Global app settings and security logic 
├── db/ # Database connection, migrations, and model base 
├── dependencies/ # FastAPI dependency injection layer per domain 
├── models/ # SQLAlchemy models for DB schema 
├── schemas/ # Pydantic models (input/output validation) 
├── services/ # Business logic layer (use-case oriented) 
├── static/ # Static file storage 
├── tests/ # Pytest test cases, per module 
├── utils/ # Helper functions used across modules 
└── main.py # FastAPI app initialization</pre>


## Component Responsibilities

- `api/v1/*.py`: Expose versioned route handlers for each functional domain.
- `core/config.py`: Loads settings from `.env`, centralizes configuration.
- `core/security.py`: JWT generation/verification, password hashing, auth logic.
- `db/database.py`: Creates DB connection with SQLAlchemy.
- `db/base.py`: Aggregates models for Alembic migration auto-discovery.
- `models/`: Contains one SQLAlchemy model file per logical domain.
- `schemas/`: Contains matching Pydantic schemas for each module.
- `services/`: Core logic that coordinates models, permissions, and business rules.
- `dependencies/`: FastAPI dependencies (e.g., get_current_user).
- `utils/`: Shared helpers (e.g., date utilities, parsing).
- `static/`: Media files like profile pictures, service images.
- `tests/`: Organized test files and fixtures.

## Domain Modules

- `auth`: Handles registration, login, JWT, and security.
- `bookings`: Manages availability, booking lifecycle, and state transitions.
- `chat`: Manages messages between clients and professionals.
- `payments`: Payment integration and platform fee logic.
- `users`: Handles client/pro profile info, role logic.

## Versioning

- All APIs are under `api/v1/` to support future interface versioning.

## Data Layer

- Models are mapped using SQLAlchemy and stored in `models/`
- Migrations handled via Alembic (under `db/migrations`)
- Pydantic schemas in `schemas/` match the DB layer for request/response validation
