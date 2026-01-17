from fastapi import APIRouter, HTTPException, status
from datetime import timedelta

from app.models.schemas import UserRegister, UserLogin, Token, UserResponse
from app.core.security import create_access_token
from app.core.config import settings
from app.services.user_service import create_user, verify_user_credentials

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """Register a new user."""
    try:
        user = await create_user(
            email=user_data.email,
            password=user_data.password,
            name=user_data.name
        )
        return UserResponse(id=user.id, email=user.email, name=user.name)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login and get access token."""
    user = await verify_user_credentials(credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.id, "email": user.email},
        expires_delta=access_token_expires
    )
    
    return Token(access_token=access_token)

