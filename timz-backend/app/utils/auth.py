from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from uuid import UUID
from app.core.config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ALGORITHM = "HS256"

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(
    user_id: UUID,
    role: str,
    token_version: int = 0,
    expires_delta: timedelta = timedelta(minutes=settings.access_token_expire_minutes)
) -> str:
    now = datetime.now(tz=timezone.utc)
    expire = now + expires_delta
    payload = {
        "sub": str(user_id),
        "role": role,
        "token_version": token_version,
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "iss": "timz-api"
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
