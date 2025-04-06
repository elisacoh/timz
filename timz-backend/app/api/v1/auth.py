from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.auth import hash_password
from app.services.auth import create_access_token, authenticate_user
from app.dependencies.auth import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.users import UserCreate, UserResponse
from app.services.auth import decode_token


router = APIRouter()

@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        name=user_data.name,
        phone=user_data.phone,
        profile_image=user_data.profile_image,
        role="user",
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    """Login user and return access token"""
    user = authenticate_user(db, email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current logged-in user"""
    return current_user

@router.post("/refresh")
def refresh_token(token: str):
    """Refresh expired token (optional)"""
    payload = decode_token(token)
    new_token = create_access_token({"sub": payload["sub"]})
    return {"access_token": new_token, "token_type": "bearer"}
