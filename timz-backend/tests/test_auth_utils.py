from app.utils.auth import *
from datetime import timedelta
import time
import pytest


def test_password_hashing_and_verification():
    raw_password = "secure_password123"
    hashed = get_password_hash(raw_password)

    assert hashed != raw_password
    assert verify_password(raw_password, hashed)
    assert not verify_password("wrong_password", hashed)

def test_create_and_decode_token():
    token = create_access_token(user_id=42, role="client", token_version=2, expires_delta=timedelta(minutes=5))
    decoded = decode_token(token)

    assert decoded["sub"] == "42"
    assert decoded["role"] == "client"
    assert decoded["token_version"] == 2
    assert decoded["iss"] == "timz-api"
    assert "exp" in decoded
    assert "iat" in decoded
    assert decoded["exp"] > decoded["iat"]

def test_token_expiration():
    token = create_access_token(user_id=1, role="admin", expires_delta=timedelta(seconds=1))
    time.sleep(2)

    with pytest.raises(Exception):
        decode_token(token)
