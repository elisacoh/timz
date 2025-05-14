# 📄 docs/auth.md – Authentication Utilities

## Password Hashing & Verification

### | `get_password_hash(password: str) -> str`

Securely hashes a plaintext password using bcrypt.

```
hashed = get_password_hash("my_password")
```

### | `verify_password(plain_password: str, hashed_password: str) -> bool`
Verifies that a given plaintext password matches the previously hashed password.
```
verify_password("my_password", hashed)  # returns True or False
```

## JWT Token Management
### | `create_access_token(user_id: int, role: str, token_version: int = 0, expires_delta: timedelta) -> str`
Generates a JWT access token with the following payload:
```
{
  "sub": "<user_id>",
  "role": "<user_role>",
  "token_version": <int>,
  "iat": <issued_at_utc_timestamp>,
  "exp": <expiry_timestamp>,
  "iss": "timz-api"
}
```
Arguments:
- user_id: Internal DB user ID
- role: User role (e.g., client, pro, admin)
- token_version: Optional, used to invalidate tokens on password reset
- expires_delta: Token lifespan (defaults to 1440 minutes) <br />

token = create_access_token(user_id=42, role="client", token_version=2) <br />

### | `decode_token(token: str) -> dict`
Decodes a JWT token using the configured JWT_SECRET.
```
payload = decode_token(token)
user_id = payload["sub"]
role = payload["role"]
```
Raises exceptions (e.g. JWTError, ExpiredSignatureError) if the token is invalid or expired.

## Token Versioning (Security)
`token_version `  is stored in the JWT payload to allow invalidation of all previously issued tokens when: <br />
- User changes password
- Admin forcefully logs out the user <br />

To enforce this: <br />
- Compare the value in the JWT to the user's token_version stored in DB.
- If mismatch → reject the token as invalid.

## Dependencies
Ensure the following are installed: <br />
``pip install python-jose[cryptography] passlib[bcrypt]``