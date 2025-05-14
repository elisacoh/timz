from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, ProfileClient, ProfilePro
from app.schemas.auth import SignupRequest, SignupResponse, Token
from app.schemas.users import UserRole, UserDetailsOut
from app.utils.auth import get_password_hash, create_access_token
from app.services.auth import authenticate_user
from app.dependencies.auth import get_current_user, require_roles
from uuid import uuid4
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from fastapi.security import OAuth2PasswordRequestForm
from uuid import UUID


router = APIRouter()

@router.post("/signup", response_model=SignupResponse, status_code=status.HTTP_201_CREATED)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    print("📥 signup route called")
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")
    print("✅ checked if user exists")
    new_user = User(
        id=uuid4(),
        email=data.email,
        full_name=data.full_name,
        hashed_password=get_password_hash(data.password),
        phone=data.phone,
        roles=data.roles,
        is_active=True,
        token_version=0,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(new_user)
    db.flush()  # Required to get the user_id for FK creation

    if UserRole.client in data.roles:
        client_profile = ProfileClient(
            user_id=new_user.id,
            phone=data.phone,
            address=data.address.dict() if data.address else None
        )
        db.add(client_profile)
    print("🧱 user created")
    if UserRole.pro in data.roles:
        pro_profile = ProfilePro(
            user_id=new_user.id,
            business_name=data.business_name,
            website=data.website,
            address=data.address.dict() if data.address else None

        )
        db.add(pro_profile)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error while creating user")
    print("💾 committed")


    access_token = create_access_token(
        user_id=new_user.id,
        role=new_user.roles,
        token_version=new_user.token_version
    )

    return SignupResponse(
        access_token=access_token,
        user_id=new_user.id,
        roles=new_user.roles
    )
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm=Depends(), db:Session = Depends(get_db)):
    user=authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        user_id=user.id,
        role=user.roles,
        token_version=user.token_version
    )

    return Token(access_token=access_token, user_id=user.id, roles=user.roles)

@router.get("/me", response_model=UserDetailsOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.token_version += 1
    db.commit()
    return


