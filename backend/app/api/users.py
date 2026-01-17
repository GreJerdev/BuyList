from fastapi import APIRouter, Depends

from app.models.schemas import UserResponse
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/me", tags=["users"])


@router.get("", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information."""
    return current_user

