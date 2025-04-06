from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Float, Enum
from datetime import datetime
from app.db.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB, UUID, ARRAY
import uuid

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    PRO = "pro"
    CLIENT = "client"
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(JSONB, nullable=False)  # Stores {"first_name": "John", "last_name": "Doe"}
    phone = Column(String, unique=True, nullable=True)
    profile_image = Column(String, nullable=False, default="/static/images/default-avatar.avif")
    created_at = Column(DateTime, default=datetime.utcnow)
    modified_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    is_active = Column(Boolean, default=True)  # User can be deactivated
    role = Column(ARRAY(String), default=["user"])  # User roles: admin, user, pro, client

    # Relationships (linked by User.id)
    client_profile = relationship("Client", back_populates="user", uselist=False)  # One-to-one
    pro_profile = relationship("Pro", back_populates="user", uselist=False)  # One-to-one

    def __repr__(self):
        return f"<User {self.email} - {self.role}>"

class Client(Base):
    __tablename__ = "clients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship with User
    user = relationship("User", back_populates="client_profile")

class Pro(Base):
    __tablename__ = "pros"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)  # Links to users.id
    bio = Column(String, nullable=True)  # Optional bio description
    rating = Column(Float, nullable=True, default=0.0)
    location = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    modified_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with User
    user = relationship("User", back_populates="pro_profile")