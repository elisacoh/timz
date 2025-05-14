# app/db/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from app.core.config import get_settings

settings = get_settings()

# Create engine
engine = create_engine(
    settings.database_url,
    echo=False,
    future=True,
    pool_pre_ping=True,         # prevent broken connections
    pool_size=10,               # default varies per DB
    max_overflow=20,            # additional connections
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    future=True
)

# Base for declarative models
Base = declarative_base()


# Dependency for route injection
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
