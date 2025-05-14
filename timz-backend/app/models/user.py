from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from uuid import uuid4, UUID as UUIDType
from app.db.database import Base
from typing import Optional



class User(Base):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)

    full_name: Mapped[str] = mapped_column(String, nullable=False)
    profile_image: Mapped[str] = mapped_column(String, nullable=False, default="/static/images/default-avatar.avif")
    phone: Mapped[str] = mapped_column(String, unique=True, nullable=True)

    roles: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=["client"])
    token_version: Mapped[int] = mapped_column(default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, server_default="true", nullable=False)

    # 🔒 vérification générale du compte (email, SMS...)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    verification_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile_client = relationship("ProfileClient", back_populates="user", uselist=False)
    profile_pro = relationship("ProfilePro", back_populates="user", uselist=False)

    def __repr__(self):
        return f"<User {self.email} - roles={self.roles}>"



class ProfileClient(Base):
    __tablename__ = "profile_clients"

    id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    phone: Mapped[str] = mapped_column(String, nullable=True)
    address: Mapped[dict] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile_client")

    def __repr__(self):
        return f"<ClientProfile user_id={self.user_id}>"


class ProfilePro(Base):
    __tablename__ = "profile_pros"

    id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUIDType] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)

    business_name: Mapped[str] = mapped_column(String, nullable=True)
    website: Mapped[str] = mapped_column(String, nullable=True)
    address: Mapped[dict] = mapped_column(JSONB, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile_pro")

    def __repr__(self):
        return f"<ProProfile user_id={self.user_id}>"

