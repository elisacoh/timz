import pytest
from uuid import uuid4
from app.schemas.auth import Token, JWTPayload
from app.schemas.users import UserRole


def test_token_defaults():
    token = Token(access_token="abc123")
    assert token.access_token == "abc123"
    assert token.token_type == "bearer"


def test_token_payload_complete():
    payload = JWTPayload(
        sub=uuid4(),
        role=[UserRole.client, UserRole.pro],
        token_version=1,
        iat=1710000000,
        exp=1710003600,
        iss="timz"
    )
    assert len(payload.role) == 2
    assert payload.iss == "timz"
