from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.api.v1 import auth, users, services

from sqlalchemy.orm import Session
from app.db.database import get_db
from sqlalchemy import text

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
app = FastAPI()

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(users.router, prefix="/api/v1/users")
app.include_router(services.router, prefix="/api/v1/services")


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

# CONNECT TO FRONTEND /TEST DEV
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)