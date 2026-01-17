import pytest


@pytest.mark.asyncio
async def test_create_list(client, test_user):
    """Test creating a list."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    list_data = {
        "name": "Test List",
        "description": "A test list"
    }
    response = await client.post("/lists", json=list_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == list_data["name"]
    assert data["owner_id"] == test_user["id"]
    assert "id" in data


@pytest.mark.asyncio
async def test_get_my_lists(client, test_user):
    """Test getting user's lists."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    
    # Create a list first
    list_data = {"name": "My List"}
    await client.post("/lists", json=list_data, headers=headers)
    
    # Get lists
    response = await client.get("/lists", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


@pytest.mark.asyncio
async def test_get_list_by_id(client, test_user):
    """Test getting a specific list."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    
    # Create a list
    list_data = {"name": "Test List"}
    create_response = await client.post("/lists", json=list_data, headers=headers)
    list_id = create_response.json()["id"]
    
    # Get the list
    response = await client.get(f"/lists/{list_id}", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == list_id
    assert data["name"] == list_data["name"]


@pytest.mark.asyncio
async def test_update_list(client, test_user):
    """Test updating a list."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    
    # Create a list
    create_response = await client.post("/lists", json={"name": "Original"}, headers=headers)
    list_id = create_response.json()["id"]
    
    # Update the list
    update_data = {"name": "Updated Name"}
    response = await client.patch(f"/lists/{list_id}", json=update_data, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"


@pytest.mark.asyncio
async def test_delete_list(client, test_user):
    """Test deleting a list."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    
    # Create a list
    create_response = await client.post("/lists", json={"name": "To Delete"}, headers=headers)
    list_id = create_response.json()["id"]
    
    # Delete the list
    response = await client.delete(f"/lists/{list_id}", headers=headers)
    assert response.status_code == 204
    
    # Verify it's deleted
    get_response = await client.get(f"/lists/{list_id}", headers=headers)
    assert get_response.status_code == 404

