from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.api.v1.auth import router as auth_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.chat import router as chat_router
from app.api.v1.payments import router as payments_router
from app.api.v1.users import router as users_router

from sqlalchemy.orm import Session
from app.db.database import get_db
from sqlalchemy import text

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
app = FastAPI()

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(auth_router, prefix="/auth", tags =["Authentification"])
app.include_router(bookings_router, prefix="/bookings", tags=["Bookings"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(payments_router, prefix="/payments", tags=["Payments"])
app.include_router(users_router, prefix="/users", tags=["Users"])

@app.get("/")
def home():
    return {"message": "Welcome to Timz Backdoor!!"}

@app.get("/ping_db")
def ping_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  # Wrap raw SQL in text()
        return {"message": "Database connected successfully!"}
    except Exception as e:
        return {"error": str(e)}