from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID
from app.schemas.users import UserRole, Address


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: UUID
    roles: List[UserRole]

class JWTPayload(BaseModel):
    sub: UUID
    role: List[UserRole]
    token_version: int
    iat: int
    exp: int
    iss: str

class SignupRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    phone: str | None = None
    address: Optional[Address] = None
    business_name: Optional[str] = None
    website: Optional[str] = None
    roles: List[UserRole]




class SignupResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: UUID
    roles: List[UserRole]