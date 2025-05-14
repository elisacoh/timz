from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, Literal, List


class ServiceBase(BaseModel):
    title: str
    description: Optional[str] = None
    base_price: Optional[float] = None
    pricing_type: Literal["fixed", "starting_from", "quote"]
    duration: Optional[int] = None
    category_id: UUID
    service_group_id: Optional[UUID] = None
    options_schemas: Optional[dict] = None
    is_active: bool = True
    is_public: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceOut(ServiceBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ServiceGroupCreate(BaseModel):
    name: str
    position: int | None = 0


class ServiceGroupOut(BaseModel):
    id: UUID
    name: str
    position: int
    created_at: datetime

    class Config:
        from_attributes = True


class CategoryCreate(BaseModel):
    name: str


class CategoryOut(BaseModel):
    id: UUID
    name: str
    created_at: datetime

    class Config:
        from_attributes = True
