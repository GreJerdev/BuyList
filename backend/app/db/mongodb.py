from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from app.core.config import settings

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None

db = MongoDB()


async def get_database():
    """Get MongoDB database instance."""
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.mongodb_url)
    return db.client[settings.mongodb_db_name]


async def close_database():
    """Close MongoDB connection."""
    if db.client:
        db.client.close()
        db.client = None

