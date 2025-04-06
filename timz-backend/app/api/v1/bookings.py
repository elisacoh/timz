from fastapi import APIRouter

router = APIRouter()
@router.get("/test")
async def test_bookings():
    return {"test": "Bookings routed!"}