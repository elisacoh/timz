from app.db.database import Base

from sqlalchemy import String, ForeignKey, Integer, DateTime, Float, Boolean, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum as PyEnum
from app.models import user, service
import app.models  # si tous les models sont importés dans __init__.py

from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, ARRAY, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB, TSVECTOR
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from uuid import uuid4, UUID as UUIDType
from app.db.database import Base



class PricingType(PyEnum):
    fixed = "fixed"
    starting_from = "starting_from"
    quote = "quote"


class Service(Base):
    __tablename__ = "services"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    pro_id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)

    base_price: Mapped[float] = mapped_column(Float, nullable=True)  # nullable if pricing_type = quote only
    pricing_type: Mapped[PricingType] = mapped_column(Enum(PricingType), default=PricingType.fixed)

    duration: Mapped[int] = mapped_column(Integer, nullable=True)  # in minutes
    # linked to category defined in advance:
    category_id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), ForeignKey("service_categories.id"), nullable=False)
    template_id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), ForeignKey("service_templates.id"), nullable=True)
    keywords: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=True)

    is_bundle: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String, default="active")  # or "pending"

    embedding: Mapped[dict] = mapped_column(JSONB, nullable=True)
    search_vector: Mapped[str] = mapped_column(TSVECTOR, nullable=True)


    service_group_id: Mapped[UUID] = mapped_column(
        ForeignKey("service_groups.id"), nullable=True)  # linked to table of services cat defined by the pro
    service_group = relationship("ServiceGroup", back_populates="services")

    options_schema: Mapped[dict] = mapped_column(JSON, nullable=True)  # used only if configurables options on

    is_public: Mapped[bool] = mapped_column(Boolean, default=True)  # for the groups visibility defined by pro

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    pro = relationship("User", back_populates="services")
    category = relationship("ServiceCategory", back_populates="services")
    template = relationship("ServiceTemplate", back_populates="services")



class ServiceGroup(Base):
    """
    This table represents the category where the pro can range their services in
    """
    __tablename__ = "service_groups"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    pro_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"),
                                         nullable=False)

    name: Mapped[str] = mapped_column(String, nullable=False)

    position: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    services = relationship("Service", back_populates="service_group")

class ServiceCategory(Base):
    __tablename__ = "services_categories"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    parent_id: Mapped[UUID | None] = mapped_column(ForeignKey("service_categories.id"), nullable=True)
    children = relationship("ServiceCategory", backref="parent", remote_side=[id])
    search_tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=True)

    services = relationship("Service", back_populates="category")

    templates = relationship("ServiceTemplate", back_populates="category")


class ServiceComponent(Base):
    __tablename__ = "service_components"

    id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    bundle_id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    component_id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), ForeignKey("services.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1)

    # Relationships
    bundle = relationship("Service", foreign_keys=[bundle_id], backref="components")
    component = relationship("Service", foreign_keys=[component_id])

class ServiceTemplate(Base):
    __tablename__ = "service_templates"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)

    category_id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), ForeignKey("service_categories.id"), nullable=False)

    keywords: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=True)
    sub_keywords: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=True)  # plus secondaires, ex: style, durée, contexte

    usage_count: Mapped[int] = mapped_column(Integer, default=0)  # 🚀 compteur de services liés

    status: Mapped[str] = mapped_column(String, default="pending")  # "pending", "official"
    is_official: Mapped[bool] = mapped_column(Boolean, default=False)  # validé manuellement ou via usage_count threshold

    embedding: Mapped[dict] = mapped_column(JSONB, nullable=True)  # NLP vector (optional)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    services = relationship("Service", back_populates="template")
    category = relationship("ServiceCategory", back_populates="templates")
