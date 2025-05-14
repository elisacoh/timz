from fastapi import Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.services.auth import decode_token
from app.db.database import get_db
from app.models.user import User
from uuid import UUID

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(db: Session = Depends(get_db), token: str = Security(oauth2_scheme)):
    payload = decode_token(token)
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid UUID format")

    user = db.query(User).filter(User.id == user_uuid).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")

    if payload["token_version"] != user.token_version:
        raise HTTPException(status_code=401, detail="Token has been invalidated")

    return user

def require_roles(allowed_roles: list[str]):
    def role_checker(user: User = Depends(get_current_user)):
        if not any(role in allowed_roles for role in user.roles):
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return role_checker
