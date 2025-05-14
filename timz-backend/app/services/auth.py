import os

import jwt
import datetime
from typing import Optional
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.utils.auth import verify_password
from dotenv import load_dotenv

from app.core.config import get_settings

settings = get_settings()
SECRET_KEY = settings.jwt_secret
if not isinstance(SECRET_KEY, str) or not SECRET_KEY:
    raise RuntimeError(" JWT_SECRET not set correctly in environment")

load_dotenv()



ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    """Generate a JWT access token"""
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + (expires_delta or datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str):
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def authenticate_user(db: Session, email: str, password: str):
    """Authenticate user by email & password"""
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
