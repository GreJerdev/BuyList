from datetime import datetime
from typing import Optional
from bson import ObjectId

from app.models.user_role import UserRole


class ListMembership:
    def __init__(
        self,
        list_id: str,
        user_id: str,
        role: UserRole,
        added_at: Optional[datetime] = None,
        id: Optional[str] = None
    ):
        self.id = id or str(ObjectId())
        self.list_id = list_id
        self.user_id = user_id
        self.role = role
        self.added_at = added_at or datetime.utcnow()
    
    def to_dict(self) -> dict:
        return {
            "_id": ObjectId(self.id) if isinstance(self.id, str) else self.id,
            "list_id": ObjectId(self.list_id) if isinstance(self.list_id, str) else self.list_id,
            "user_id": ObjectId(self.user_id) if isinstance(self.user_id, str) else self.user_id,
            "role": self.role.value,
            "added_at": self.added_at
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "ListMembership":
        from app.models.user_role import UserRole
        return cls(
            id=str(data["_id"]),
            list_id=str(data["list_id"]),
            user_id=str(data["user_id"]),
            role=UserRole(data["role"]),
            added_at=data.get("added_at", datetime.utcnow())
        )

