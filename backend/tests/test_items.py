import pytest


@pytest.mark.asyncio
async def test_add_item_to_list(client, test_user):
    """Test adding an item to a list."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    
    # Create a list
    create_response = await client.post("/lists", json={"name": "Test List"}, headers=headers)
    list_id = create_response.json()["id"]
    
    # Add an item
    item_data = {
        "name": "Milk",
        "quantity": 2.0,
        "unit_price": 3.50,
        "currency": "USD"
    }
    response = await client.post(f"/lists/{list_id}/items", json=item_data, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == item_data["name"]
    assert data["quantity"] == item_data["quantity"]
    assert data["total_price"] == item_data["quantity"] * item_data["unit_price"]


@pytest.mark.asyncio
async def test_update_item(client, test_user):
    """Test updating an item."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    
    # Create a list and item
    create_response = await client.post("/lists", json={"name": "Test List"}, headers=headers)
    list_id = create_response.json()["id"]
    
    item_response = await client.post(
        f"/lists/{list_id}/items",
        json={"name": "Milk", "quantity": 1.0, "unit_price": 3.50},
        headers=headers
    )
    item_id = item_response.json()["id"]
    
    # Update the item
    update_data = {
        "quantity": 2.0,
        "version": item_response.json()["version"]
    }
    response = await client.patch(
        f"/lists/{list_id}/items/{item_id}",
        json=update_data,
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["quantity"] == 2.0


@pytest.mark.asyncio
async def test_mark_item_bought(client, test_user):
    """Test marking an item as bought."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    
    # Create a list and item
    create_response = await client.post("/lists", json={"name": "Test List"}, headers=headers)
    list_id = create_response.json()["id"]
    
    item_response = await client.post(
        f"/lists/{list_id}/items",
        json={"name": "Milk", "quantity": 1.0, "unit_price": 3.50},
        headers=headers
    )
    item_id = item_response.json()["id"]
    
    # Mark as bought
    update_data = {
        "bought": True,
        "version": item_response.json()["version"]
    }
    response = await client.patch(
        f"/lists/{list_id}/items/{item_id}",
        json=update_data,
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["bought"] is True
    assert data["bought_by"] == test_user["id"]


@pytest.mark.asyncio
async def test_concurrent_update_conflict(client, test_user):
    """Test optimistic concurrency control."""
    headers = {"Authorization": f"Bearer {test_user['token']}"}
    
    # Create a list and item
    create_response = await client.post("/lists", json={"name": "Test List"}, headers=headers)
    list_id = create_response.json()["id"]
    
    item_response = await client.post(
        f"/lists/{list_id}/items",
        json={"name": "Milk", "quantity": 1.0, "unit_price": 3.50},
        headers=headers
    )
    item_id = item_response.json()["id"]
    version = item_response.json()["version"]
    
    # Try to update with wrong version
    update_data = {
        "quantity": 2.0,
        "version": version - 1  # Wrong version
    }
    response = await client.patch(
        f"/lists/{list_id}/items/{item_id}",
        json=update_data,
        headers=headers
    )
    assert response.status_code == 409  # Conflict

