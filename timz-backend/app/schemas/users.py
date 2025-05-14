from pydantic import BaseModel, EmailStr
from uuid import UUID
from enum import Enum
from typing import Optional, List
from datetime import datetime

from app.models.user import ProfilePro, ProfileClient

DEFAULT_PROFILE_IMAGE = "/static/images/default-avatar.avif"



class UserRole(str, Enum):
    client = "client"
    pro = "pro"
    admin = "admin"


class Address(BaseModel):
    street: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: str | None = None
    profile_image: str = DEFAULT_PROFILE_IMAGE
    roles: List[UserRole]


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProfileClientOut(BaseModel):
    phone: Optional[str] = None
    address: Optional[Address] = None

    class Config:
        from_attributes = True


class ProfileProOut(BaseModel):
    business_name: Optional[str] = None
    website: Optional[str] = None
    address: Optional[Address] = None


    class Config:
        from_attributes = True


class UserDetailsOut(UserOut):
    profile_client: Optional[ProfileClientOut]
    profile_pro: Optional[ProfileProOut]


class AddRoleRequest(BaseModel):
    role: UserRole
    business_name: Optional[str] = None
    website: Optional[str] = None
    address: Optional[Address] = None

class RoleDeleteRequest(BaseModel):
    role: UserRole