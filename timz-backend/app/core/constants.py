# app/core/constants.py

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 1 day
REFRESH_TOKEN_EXPIRE_DAYS = 30

TOKEN_ALGORITHM = "HS256"

ROLES = {
    "client": "client",
    "pro": "pro",
    "admin": "admin"
}

BOOKING_STATUSES = [
    "pending",
    "confirmed",
    "cancelled",
    "refused",
    "completed"
]
