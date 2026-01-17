from typing import Optional
from bson import ObjectId
from datetime import datetime

from app.db.mongodb import get_database
from app.models.user import User
from app.core.security import get_password_hash, verify_password


async def create_user(email: str, password: str, name: str) -> User:
    """Create a new user."""
    db = await get_database()
    
    # Check if user exists
    existing = await db.users.find_one({"email": email})
    if existing:
        raise ValueError("User with this email already exists")
    
    user = User(
        email=email,
        password_hash=get_password_hash(password),
        name=name
    )
    
    await db.users.insert_one(user.to_dict())
    return user


async def get_user_by_email(email: str) -> Optional[User]:
    """Get user by email."""
    db = await get_database()
    user_data = await db.users.find_one({"email": email})
    if user_data:
        return User.from_dict(user_data)
    return None


async def get_user_by_id(user_id: str) -> Optional[User]:
    """Get user by ID."""
    db = await get_database()
    try:
        user_data = await db.users.find_one({"_id": ObjectId(user_id)})
        if user_data:
            return User.from_dict(user_data)
    except Exception:
        pass
    return None


async def verify_user_credentials(email: str, password: str) -> Optional[User]:
    """Verify user credentials and return user if valid."""
    user = await get_user_by_email(email)
    if user and verify_password(password, user.password_hash):
        return user
    return None

