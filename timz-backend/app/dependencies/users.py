from app.db.database import SessionLocal


# Dependency to get DB session in API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
