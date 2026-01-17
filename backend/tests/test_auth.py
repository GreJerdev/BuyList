import pytest


@pytest.mark.asyncio
async def test_register(client):
    """Test user registration."""
    user_data = {
        "email": "newuser@example.com",
        "password": "password123",
        "name": "New User"
    }
    response = await client.post("/auth/register", json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["name"] == user_data["name"]
    assert "id" in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client, test_user):
    """Test registration with duplicate email fails."""
    user_data = {
        "email": test_user["email"],
        "password": "password123",
        "name": "Another User"
    }
    response = await client.post("/auth/register", json=user_data)
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_login(client, test_user):
    """Test user login."""
    response = await client.post("/auth/login", json={
        "email": test_user["email"],
        "password": test_user["password"]
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client, test_user):
    """Test login with wrong password fails."""
    response = await client.post("/auth/login", json={
        "email": test_user["email"],
        "password": "wrongpassword"
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me(client, test_user):
    """Test getting current user info."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    response = await client.get("/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["id"] == test_user["id"]

