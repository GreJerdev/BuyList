from datetime import datetime
from typing import Optional, List
from bson import ObjectId

from app.models.list_item import ListItem


class BuyList:
    def __init__(
        self,
        name: str,
        owner_id: str,
        description: Optional[str] = None,
        id: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        version: int = 1,
        items: Optional[List[ListItem]] = None
    ):
        self.id = id or str(ObjectId())
        self.name = name
        self.description = description
        self.owner_id = owner_id
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.version = version
        self.items = items or []
    
    @property
    def total_price(self) -> float:
        return sum(item.total_price for item in self.items if not item.bought)
    
    def to_dict(self) -> dict:
        return {
            "_id": ObjectId(self.id) if isinstance(self.id, str) else self.id,
            "name": self.name,
            "description": self.description,
            "owner_id": ObjectId(self.owner_id) if isinstance(self.owner_id, str) else self.owner_id,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "version": self.version,
            "items": [item.to_dict() for item in self.items]
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "BuyList":
        from app.models.list_item import ListItem
        items = [ListItem.from_dict(item) for item in data.get("items", [])]
        return cls(
            id=str(data["_id"]),
            name=data["name"],
            description=data.get("description"),
            owner_id=str(data["owner_id"]),
            created_at=data.get("created_at", datetime.utcnow()),
            updated_at=data.get("updated_at", datetime.utcnow()),
            version=data.get("version", 1),
            items=items
        )

