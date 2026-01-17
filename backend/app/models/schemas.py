from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

from app.models.user_role import UserRole


# Auth schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    
    class Config:
        from_attributes = True


# List schemas
class ListCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None


class ListUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None


class ListResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    owner_id: str
    created_at: datetime
    updated_at: datetime
    version: int
    total_price: float = 0.0
    items_count: int = 0
    items: Optional[List[ItemResponse]] = None
    
    class Config:
        from_attributes = True


# Item schemas
class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    notes: Optional[str] = None
    category: Optional[str] = None
    quantity: float = Field(1.0, gt=0)
    unit_price: float = Field(0.0, ge=0)
    currency: str = Field("USD", max_length=3)


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    notes: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[float] = Field(None, gt=0)
    unit_price: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = Field(None, max_length=3)
    bought: Optional[bool] = None
    version: Optional[int] = None  # For optimistic concurrency


class ItemResponse(BaseModel):
    id: str
    name: str
    notes: Optional[str]
    category: Optional[str]
    quantity: float
    unit_price: float
    currency: str
    total_price: float
    bought: bool
    bought_by: Optional[str]
    bought_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    version: int
    
    class Config:
        from_attributes = True


# Sharing schemas
class ListShare(BaseModel):
    user_email: EmailStr
    role: UserRole = UserRole.EDITOR


class ListMemberResponse(BaseModel):
    user_id: str
    user_email: str
    user_name: str
    role: UserRole
    added_at: datetime


# Model service schemas
class CategorySuggestionRequest(BaseModel):
    item_name: str
    notes: Optional[str] = None


class CategorySuggestionResponse(BaseModel):
    category_suggestion: str

