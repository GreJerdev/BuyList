import pytest
from httpx import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient

from app.main import app
from app.db.mongodb import get_database, db
from app.core.config import settings


@pytest.fixture
async def test_db():
    """Create a test database."""
    # Use a test database
    test_db_name = f"{settings.mongodb_db_name}_test"
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    test_db = db.client[test_db_name]
    
    yield test_db
    
    # Cleanup: drop test database
    await db.client.drop_database(test_db_name)
    db.client.close()
    db.client = None


@pytest.fixture
async def client(test_db):
    """Create a test client."""
    async def override_get_db():
        return test_db
    
    app.dependency_overrides[get_database] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
async def test_user(client):
    """Create a test user and return credentials."""
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "name": "Test User"
    }
    response = await client.post("/auth/register", json=user_data)
    assert response.status_code == 201
    
    # Login to get token
    login_response = await client.post("/auth/login", json={
        "email": user_data["email"],
        "password": user_data["password"]
    })
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    
    return {
        **user_data,
        "token": token,
        "id": response.json()["id"]
    }

