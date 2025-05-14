import pytest
from uuid import uuid4

# Test d'inscription réussie
def test_signup_success(client):
    payload = {
        "email": "user1@example.com",
        "full_name": "User One",
        "password": "secret123",
        "phone": "0102030405",
        "address": {
            "street": "1 rue Test",
            "city": "Paris",
            "postal_code": "75000",
            "country": "FR"
        }
    }

    response = client.post("/api/v1/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert "user_id" in data


# Test avec email déjà utilisé
def test_signup_duplicate_email(client):
    payload = {
        "email": "user2@example.com",
        "full_name": "User Two",
        "password": "secret123",
        "phone": "0102030406",
        "address": None
    }

    # Première fois → OK
    response1 = client.post("/api/v1/auth/signup", json=payload)
    assert response1.status_code == 201

    # Deuxième fois → Conflit
    response2 = client.post("/api/v1/auth/signup", json=payload)
    assert response2.status_code == 409
    assert response2.json()["detail"] == "Email already registered"


# Test avec un body invalide
@pytest.mark.parametrize("invalid_payload", [
    {},  # vide
    {"email": "not-an-email", "full_name": "X", "password": "short"},  # email faux
    {"email": "x@y.com", "full_name": "Missing Password"},  # champ manquant
])
def test_signup_invalid_payload(client, invalid_payload):
    response = client.post("/api/v1/auth/signup", json=invalid_payload)
    assert response.status_code == 422
