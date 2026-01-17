from datetime import datetime
from typing import Optional
from bson import ObjectId


class ListItem:
    def __init__(
        self,
        name: str,
        quantity: float = 1.0,
        unit_price: float = 0.0,
        currency: str = "USD",
        notes: Optional[str] = None,
        category: Optional[str] = None,
        bought: bool = False,
        bought_by: Optional[str] = None,
        bought_at: Optional[datetime] = None,
        id: Optional[str] = None,
        created_at: Optional[datetime] = None,
        updated_at: Optional[datetime] = None,
        version: int = 1
    ):
        self.id = id or str(ObjectId())
        self.name = name
        self.notes = notes
        self.category = category
        self.quantity = quantity
        self.unit_price = unit_price
        self.currency = currency
        self.bought = bought
        self.bought_by = bought_by
        self.bought_at = bought_at
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.version = version
    
    @property
    def total_price(self) -> float:
        return self.quantity * self.unit_price
    
    def to_dict(self) -> dict:
        return {
            "_id": ObjectId(self.id) if isinstance(self.id, str) else self.id,
            "name": self.name,
            "notes": self.notes,
            "category": self.category,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
            "currency": self.currency,
            "bought": self.bought,
            "bought_by": ObjectId(self.bought_by) if self.bought_by and isinstance(self.bought_by, str) else self.bought_by,
            "bought_at": self.bought_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "version": self.version
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "ListItem":
        return cls(
            id=str(data["_id"]),
            name=data["name"],
            notes=data.get("notes"),
            category=data.get("category"),
            quantity=data.get("quantity", 1.0),
            unit_price=data.get("unit_price", 0.0),
            currency=data.get("currency", "USD"),
            bought=data.get("bought", False),
            bought_by=str(data["bought_by"]) if data.get("bought_by") else None,
            bought_at=data.get("bought_at"),
            created_at=data.get("created_at", datetime.utcnow()),
            updated_at=data.get("updated_at", datetime.utcnow()),
            version=data.get("version", 1)
        )

