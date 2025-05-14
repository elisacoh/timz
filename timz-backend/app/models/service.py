from app.db.database import Base

from sqlalchemy import String, ForeignKey, Integer, DateTime, Float, Boolean, Enum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from uuid import UUID, uuid4
from enum import Enum as PyEnum
from app.models import user, service
import app.models  # si tous les models sont importés dans __init__.py



class PricingType(PyEnum):
    fixed = "fixed"
    starting_from = "starting_from"
    quote = "quote"


class Service(Base):
    __tablename__ = "services"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    pro_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)

    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)

    base_price: Mapped[float] = mapped_column(Float, nullable=True)  # nullable if pricing_type = quote only
    pricing_type: Mapped[PricingType] = mapped_column(Enum(PricingType), default=PricingType.fixed)

    duration: Mapped[int] = mapped_column(Integer, nullable=True)  # in minutes
    category_id: Mapped[UUID] = mapped_column(ForeignKey("services_categories.id"),
                                              nullable=False)  # linked to category defined in advance (e.g.
                                                                # haistyle, hairdressing...)

    service_group_id: Mapped[UUID] = mapped_column(
        ForeignKey("service_groups.id"), nullable=True)  # linked to table of services cat defined by the pro
    service_group = relationship("ServiceGroup", back_populates="services")

    options_schema: Mapped[dict] = mapped_column(JSON, nullable=True)  # used only if configurables options on

    is_public: Mapped[bool] = mapped_column(Boolean, default=True)  # for the groups visibility defined by pro

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


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
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    services = relationship("Service", back_populates="service_group")

class Category(Base):
    __tablename__ = "services_categories"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
