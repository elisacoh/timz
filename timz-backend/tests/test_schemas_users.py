import pytest
from uuid import uuid4
from datetime import datetime
from pydantic import ValidationError, EmailStr

from app.schemas.users import (
    UserRole, Address, UserBase, UserCreate,
    UserOut, ProfileClientOut, ProfileProOut, UserDetailsOut,
    DEFAULT_PROFILE_IMAGE
)


def test_valid_user_role_enum():
    assert UserRole.client == "client"
    assert UserRole("pro") == UserRole.pro
    with pytest.raises(ValueError):
        UserRole("invalid")


def test_address_optional_fields():
    addr = Address()
    assert addr.street is None
    assert addr.city is None
    assert addr.postal_code is None
    assert addr.country is None

    addr_full = Address(street="Main", city="NY", postal_code="10001", country="US")
    assert addr_full.city == "NY"


def test_user_base_schema_defaults():
    data = {
        "email": "test@example.com",
        "full_name": "Test User",
        "roles": ["client"]
    }
    user = UserBase(**data)
    assert user.phone is None
    assert user.profile_image == DEFAULT_PROFILE_IMAGE
    assert user.roles == [UserRole.client]


def test_user_base_invalid_email():
    with pytest.raises(ValidationError):
        UserBase(email="invalid", full_name="Test", roles=["client"])


def test_user_base_invalid_role():
    with pytest.raises(ValidationError):
        UserBase(email="a@b.com", full_name="Test", roles=["wrong"])


def test_user_create_inherits_user_base():
    data = {
        "email": "test@example.com",
        "full_name": "Tester",
        "phone": "123456789",
        "roles": ["client", "pro"],
        "password": "secret"
    }
    obj = UserCreate(**data)
    assert obj.password == "secret"
    assert UserRole.pro in obj.roles


def test_user_out_model():
    now = datetime.utcnow()
    data = {
        "email": "test@x.com",
        "full_name": "Test Out",
        "phone": "444",
        "roles": ["pro"],
        "id": uuid4(),
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }
    user = UserOut(**data)
    assert user.is_active
    assert user.created_at == now


def test_profile_client_out_defaults():
    profile = ProfileClientOut()
    assert profile.phone is None
    assert profile.address is None


def test_profile_pro_out_partial():
    profile = ProfileProOut(business_name="Pro Biz")
    assert profile.business_name == "Pro Biz"
    assert profile.website is None
    assert profile.address is None


def test_user_details_out_combines_profiles():
    data = {
        "email": "x@y.com",
        "full_name": "Full",
        "phone": None,
        "roles": ["client", "pro"],
        "id": uuid4(),
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "profile_client": {
            "phone": "999999",
            "address": {"street": "123", "city": "Somewhere"}
        },
        "profile_pro": {
            "business_name": "Biz",
            "website": "http://pro.com"
        }
    }
    user = UserDetailsOut(**data)
    assert user.profile_client.phone == "999999"
    assert user.profile_pro.business_name == "Biz"
