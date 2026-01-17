from datetime import datetime
from typing import Optional
from bson import ObjectId


class User:
    def __init__(
        self,
        email: str,
        password_hash: str,
        name: str,
        id: Optional[str] = None,
        created_at: Optional[datetime] = None
    ):
        self.id = id or str(ObjectId())
        self.email = email
        self.password_hash = password_hash
        self.name = name
        self.created_at = created_at or datetime.utcnow()
    
    def to_dict(self) -> dict:
        return {
            "_id": ObjectId(self.id) if isinstance(self.id, str) else self.id,
            "email": self.email,
            "password_hash": self.password_hash,
            "name": self.name,
            "created_at": self.created_at
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "User":
        return cls(
            id=str(data["_id"]),
            email=data["email"],
            password_hash=data["password_hash"],
            name=data["name"],
            created_at=data.get("created_at", datetime.utcnow())
        )

