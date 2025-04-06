from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
import re

from pydantic_settings import SettingsConfigDict


# *********************************************** USER *****************************************************************

# This is the Base schema that will make us inherit common fields
class UserBase(BaseModel):
    email: EmailStr
    name: dict  # {"first_name": "John, "last_name":"Doe"}
    phone: Optional[str] = None
    profile_image: Optional[str] = None



# Schema for creating a user:
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")
    is_active: bool = True
    role: List[str] = ["user"]

    @field_validator("password")
    def validate_password(cls, password):
        """
        Enforces password security rules:
        - At least 8 characters
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one number
        """
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one number")
        return password


# Schema for returning user data (read model)
class UserResponse(UserBase):
    id: UUID
    role: str
    created_at: datetime
    is_active: bool

    class Config:
        model_config = SettingsConfigDict(from_attributes=True)
        from_attributes = True

# Schema for updating User
class UserUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[dict] = None
    phone: Optional[str] = None
    profile_image: Optional[str] = None


# *********************************************** PROS *****************************************************************

# Pro schemas
class ProBase(BaseModel):
    bio: Optional[str] = None
    rating: float = 0.0
    location: dict = None


class ProResponse(ProBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        model_config = SettingsConfigDict(from_attributes=True)


# Schema for updating Pro
class ProUpdate(BaseModel):
    bio: Optional[str] = None
    rating: Optional[float] = None
    location: Optional[str] = None


# *********************************************** CLIENTS **************************************************************

# Base schema for Client (even if currently empty)
class ClientBase(BaseModel):
    pass  # No extra fields for now


# Response schema for Client
class ClientResponse(ClientBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True  # Needed for Pydantic v2 to work with SQLAlchemy
        model_config = SettingsConfigDict(from_attributes=True)


# Schema for updating Client (currently empty)
class ClientUpdate(BaseModel):
    pass