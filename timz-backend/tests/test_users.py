import pytest
from app.models.user import User
from uuid import uuid4
from datetime import datetime


def test_user_creation():
    user = User(
        id=uuid4(),
        email="test@example.com",
        hashed_password="hashed123",
        full_name="Jane Doe",
        profile_image="/static/images/default-avatar.avif",
        phone="0123456789",
        roles=["client"],
        token_version=0,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    assert user.email == "test@example.com"
    assert user.full_name == "Jane Doe"
    assert user.roles == ["client"]
    assert user.is_active is True
    assert isinstance(user.created_at, datetime)
    assert isinstance(user.updated_at, datetime)


def test_user_repr():
    user = User(email="test@example.com", roles=["admin"])
    assert "test@example.com" in repr(user)
    assert "admin" in repr(user)
