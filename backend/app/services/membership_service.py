from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from app.db.mongodb import get_database
from app.models.list_membership import ListMembership
from app.models.user_role import UserRole
from app.services.user_service import get_user_by_email


async def add_list_member(list_id: str, user_email: str, role: UserRole) -> Optional[ListMembership]:
    """Add a member to a list."""
    db = await get_database()
    
    # Get user by email
    user = await get_user_by_email(user_email)
    if not user:
        raise ValueError("User not found")
    
    # Check if membership already exists
    existing = await db.list_memberships.find_one({
        "list_id": ObjectId(list_id),
        "user_id": ObjectId(user.id)
    })
    if existing:
        # Update role
        await db.list_memberships.update_one(
            {"_id": existing["_id"]},
            {"$set": {"role": role.value}}
        )
        return ListMembership.from_dict(existing)
    
    membership = ListMembership(
        list_id=list_id,
        user_id=user.id,
        role=role
    )
    
    await db.list_memberships.insert_one(membership.to_dict())
    return membership


async def remove_list_member(list_id: str, user_id: str) -> bool:
    """Remove a member from a list."""
    db = await get_database()
    result = await db.list_memberships.delete_one({
        "list_id": ObjectId(list_id),
        "user_id": ObjectId(user_id)
    })
    return result.deleted_count > 0


async def get_list_members(list_id: str) -> List[dict]:
    """Get all members of a list with user details."""
    db = await get_database()
    
    memberships = await db.list_memberships.find({"list_id": ObjectId(list_id)}).to_list(length=None)
    
    result = []
    for membership in memberships:
        user = await db.users.find_one({"_id": membership["user_id"]})
        if user:
            result.append({
                "user_id": str(user["_id"]),
                "user_email": user["email"],
                "user_name": user["name"],
                "role": membership["role"],
                "added_at": membership["added_at"]
            })
    
    return result


async def get_user_list_role(list_id: str, user_id: str) -> Optional[UserRole]:
    """Get user's role for a list (owner, member, or None)."""
    db = await get_database()
    
    # Check if owner
    list_data = await db.lists.find_one({"_id": ObjectId(list_id)})
    if list_data and str(list_data["owner_id"]) == user_id:
        return UserRole.OWNER
    
    # Check membership
    membership = await db.list_memberships.find_one({
        "list_id": ObjectId(list_id),
        "user_id": ObjectId(user_id)
    })
    if membership:
        return UserRole(membership["role"])
    
    return None


async def check_list_access(list_id: str, user_id: str) -> bool:
    """Check if user has access to a list."""
    role = await get_user_list_role(list_id, user_id)
    return role is not None

