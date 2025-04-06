from app.core import constants

def test_constants_present():
    assert "client" in constants.ROLES
    assert "pending" in constants.BOOKING_STATUSES
