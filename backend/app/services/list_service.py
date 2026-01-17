from typing import Optional, List
from bson import ObjectId
from datetime import datetime

from app.db.mongodb import get_database
from app.models.buy_list import BuyList
from app.models.list_item import ListItem
from app.models.user_role import UserRole
from app.models.schemas import ItemCreate, ItemUpdate


async def create_list(name: str, owner_id: str, description: Optional[str] = None) -> BuyList:
    """Create a new list."""
    db = await get_database()
    
    buy_list = BuyList(
        name=name,
        owner_id=owner_id,
        description=description
    )
    
    await db.lists.insert_one(buy_list.to_dict())
    return buy_list


async def get_list_by_id(list_id: str) -> Optional[BuyList]:
    """Get list by ID."""
    db = await get_database()
    try:
        list_data = await db.lists.find_one({"_id": ObjectId(list_id)})
        if list_data:
            return BuyList.from_dict(list_data)
    except Exception:
        pass
    return None


async def get_user_lists(user_id: str) -> List[BuyList]:
    """Get all lists accessible by a user (owned or shared)."""
    db = await get_database()
    user_obj_id = ObjectId(user_id)
    
    # Get lists owned by user
    owned_lists = await db.lists.find({"owner_id": user_obj_id}).to_list(length=None)
    
    # Get lists shared with user
    memberships = await db.list_memberships.find({"user_id": user_obj_id}).to_list(length=None)
    shared_list_ids = [ObjectId(m["list_id"]) for m in memberships]
    shared_lists = []
    if shared_list_ids:
        shared_lists = await db.lists.find({"_id": {"$in": shared_list_ids}}).to_list(length=None)
    
    # Combine and deduplicate
    all_lists = owned_lists + shared_lists
    unique_lists = {str(l["_id"]): l for l in all_lists}.values()
    
    return [BuyList.from_dict(l) for l in unique_lists]


async def update_list(list_id: str, name: Optional[str] = None, description: Optional[str] = None) -> Optional[BuyList]:
    """Update list metadata."""
    db = await get_database()
    
    update_data = {"updated_at": datetime.utcnow()}
    if name is not None:
        update_data["name"] = name
    if description is not None:
        update_data["description"] = description
    
    result = await db.lists.find_one_and_update(
        {"_id": ObjectId(list_id)},
        {"$set": update_data, "$inc": {"version": 1}},
        return_document=True
    )
    
    if result:
        return BuyList.from_dict(result)
    return None


async def delete_list(list_id: str) -> bool:
    """Delete a list."""
    db = await get_database()
    result = await db.lists.delete_one({"_id": ObjectId(list_id)})
    
    # Also delete memberships
    await db.list_memberships.delete_many({"list_id": ObjectId(list_id)})
    
    return result.deleted_count > 0


async def add_item_to_list(list_id: str, item_data: ItemCreate) -> Optional[ListItem]:
    """Add an item to a list."""
    db = await get_database()
    
    item = ListItem(
        name=item_data.name,
        notes=item_data.notes,
        category=item_data.category,
        quantity=item_data.quantity,
        unit_price=item_data.unit_price,
        currency=item_data.currency
    )
    
    result = await db.lists.find_one_and_update(
        {"_id": ObjectId(list_id)},
        {
            "$push": {"items": item.to_dict()},
            "$set": {"updated_at": datetime.utcnow()},
            "$inc": {"version": 1}
        },
        return_document=True
    )
    
    if result:
        return item
    return None


async def update_list_item(
    list_id: str,
    item_id: str,
    item_update: ItemUpdate,
    user_id: Optional[str] = None
) -> Optional[ListItem]:
    """Update an item in a list with optimistic concurrency control."""
    db = await get_database()
    
    # Get current list to check version
    current_list = await get_list_by_id(list_id)
    if not current_list:
        return None
    
    # Find the item
    item = next((i for i in current_list.items if i.id == item_id), None)
    if not item:
        return None
    
    # Check version for optimistic concurrency
    if item_update.version is not None and item_update.version != item.version:
        raise ValueError("Item was modified by another user. Please refresh and try again.")
    
    # Build update data
    update_data = {
        "items.$.updated_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    if item_update.name is not None:
        update_data["items.$.name"] = item_update.name
    if item_update.notes is not None:
        update_data["items.$.notes"] = item_update.notes
    if item_update.category is not None:
        update_data["items.$.category"] = item_update.category
    if item_update.quantity is not None:
        update_data["items.$.quantity"] = item_update.quantity
    if item_update.unit_price is not None:
        update_data["items.$.unit_price"] = item_update.unit_price
    if item_update.currency is not None:
        update_data["items.$.currency"] = item_update.currency
    if item_update.bought is not None:
        update_data["items.$.bought"] = item_update.bought
        if item_update.bought:
            update_data["items.$.bought_by"] = ObjectId(user_id) if user_id else None
            update_data["items.$.bought_at"] = datetime.utcnow()
        else:
            update_data["items.$.bought_by"] = None
            update_data["items.$.bought_at"] = None
    
    update_data["items.$.version"] = item.version + 1
    
    result = await db.lists.find_one_and_update(
        {"_id": ObjectId(list_id), "items._id": ObjectId(item_id)},
        {"$set": update_data, "$inc": {"version": 1}},
        return_document=True
    )
    
    if result:
        updated_list = BuyList.from_dict(result)
        updated_item = next((i for i in updated_list.items if i.id == item_id), None)
        return updated_item
    return None


async def delete_list_item(list_id: str, item_id: str) -> bool:
    """Delete an item from a list."""
    db = await get_database()
    
    result = await db.lists.find_one_and_update(
        {"_id": ObjectId(list_id)},
        {
            "$pull": {"items": {"_id": ObjectId(item_id)}},
            "$set": {"updated_at": datetime.utcnow()},
            "$inc": {"version": 1}
        }
    )
    
    return result is not None

