from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from bson.errors import InvalidId

from app.models.schemas import (
    ListCreate, ListUpdate, ListResponse, ItemCreate, ItemUpdate,
    ItemResponse, ListShare, ListMemberResponse, UserResponse
)
from app.models.user_role import UserRole
from app.api.dependencies import get_current_user
from app.services.list_service import (
    create_list, get_list_by_id, get_user_lists, update_list,
    delete_list, add_item_to_list, update_list_item, delete_list_item
)
from app.services.membership_service import (
    add_list_member, remove_list_member, get_list_members,
    check_list_access, get_user_list_role
)
from app.core.security import object_id_to_str

router = APIRouter(prefix="/lists", tags=["lists"])


@router.post("", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
async def create_new_list(
    list_data: ListCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new list."""
    buy_list = await create_list(
        name=list_data.name,
        owner_id=current_user.id,
        description=list_data.description
    )
    return ListResponse(
        id=buy_list.id,
        name=buy_list.name,
        description=buy_list.description,
        owner_id=buy_list.owner_id,
        created_at=buy_list.created_at,
        updated_at=buy_list.updated_at,
        version=buy_list.version,
        total_price=buy_list.total_price,
        items_count=len(buy_list.items),
        items=[
            ItemResponse(
                id=item.id,
                name=item.name,
                notes=item.notes,
                category=item.category,
                quantity=item.quantity,
                unit_price=item.unit_price,
                currency=item.currency,
                total_price=item.total_price,
                bought=item.bought,
                bought_by=item.bought_by,
                bought_at=item.bought_at,
                created_at=item.created_at,
                updated_at=item.updated_at,
                version=item.version
            )
            for item in buy_list.items
        ]
    )


@router.get("", response_model=List[ListResponse])
async def get_my_lists(current_user: UserResponse = Depends(get_current_user)):
    """Get all lists accessible by current user."""
    lists = await get_user_lists(current_user.id)
    return [
        ListResponse(
            id=l.id,
            name=l.name,
            description=l.description,
            owner_id=l.owner_id,
            created_at=l.created_at,
            updated_at=l.updated_at,
            version=l.version,
            total_price=l.total_price,
            items_count=len(l.items),
            items=[
                ItemResponse(
                    id=item.id,
                    name=item.name,
                    notes=item.notes,
                    category=item.category,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    currency=item.currency,
                    total_price=item.total_price,
                    bought=item.bought,
                    bought_by=item.bought_by,
                    bought_at=item.bought_at,
                    created_at=item.created_at,
                    updated_at=item.updated_at,
                    version=item.version
                )
                for item in l.items
            ]
        )
        for l in lists
    ]


@router.get("/{list_id}", response_model=ListResponse)
async def get_list(
    list_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get a specific list by ID."""
    try:
        if not await check_list_access(list_id, current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this list"
            )
        
        buy_list = await get_list_by_id(list_id)
        if not buy_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="List not found"
            )
        
        return ListResponse(
            id=buy_list.id,
            name=buy_list.name,
            description=buy_list.description,
            owner_id=buy_list.owner_id,
            created_at=buy_list.created_at,
            updated_at=buy_list.updated_at,
            version=buy_list.version,
            total_price=buy_list.total_price,
            items_count=len(buy_list.items),
            items=[
                ItemResponse(
                    id=item.id,
                    name=item.name,
                    notes=item.notes,
                    category=item.category,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    currency=item.currency,
                    total_price=item.total_price,
                    bought=item.bought,
                    bought_by=item.bought_by,
                    bought_at=item.bought_at,
                    created_at=item.created_at,
                    updated_at=item.updated_at,
                    version=item.version
                )
                for item in buy_list.items
            ]
        )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid list ID"
        )


@router.patch("/{list_id}", response_model=ListResponse)
async def update_list_metadata(
    list_id: str,
    list_update: ListUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update list metadata."""
    try:
        if not await check_list_access(list_id, current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this list"
            )
        
        role = await get_user_list_role(list_id, current_user.id)
        if role not in [UserRole.OWNER, UserRole.EDITOR]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to edit this list"
            )
        
        buy_list = await update_list(
            list_id=list_id,
            name=list_update.name,
            description=list_update.description
        )
        
        if not buy_list:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="List not found"
            )
        
        return ListResponse(
            id=buy_list.id,
            name=buy_list.name,
            description=buy_list.description,
            owner_id=buy_list.owner_id,
            created_at=buy_list.created_at,
            updated_at=buy_list.updated_at,
            version=buy_list.version,
            total_price=buy_list.total_price,
            items_count=len(buy_list.items),
            items=[
                ItemResponse(
                    id=item.id,
                    name=item.name,
                    notes=item.notes,
                    category=item.category,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    currency=item.currency,
                    total_price=item.total_price,
                    bought=item.bought,
                    bought_by=item.bought_by,
                    bought_at=item.bought_at,
                    created_at=item.created_at,
                    updated_at=item.updated_at,
                    version=item.version
                )
                for item in buy_list.items
            ]
        )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid list ID"
        )


@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_list_by_id(
    list_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a list."""
    try:
        role = await get_user_list_role(list_id, current_user.id)
        if role != UserRole.OWNER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the owner can delete this list"
            )
        
        success = await delete_list(list_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="List not found"
            )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid list ID"
        )


@router.post("/{list_id}/share", response_model=ListMemberResponse)
async def share_list(
    list_id: str,
    share_data: ListShare,
    current_user: UserResponse = Depends(get_current_user)
):
    """Share a list with another user."""
    try:
        role = await get_user_list_role(list_id, current_user.id)
        if role != UserRole.OWNER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the owner can share this list"
            )
        
        membership = await add_list_member(
            list_id=list_id,
            user_email=share_data.user_email,
            role=share_data.role
        )
        
        if not membership:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to add member"
            )
        
        # Get user details for response
        members = await get_list_members(list_id)
        member = next((m for m in members if m["user_id"] == membership.user_id), None)
        
        if member:
            return ListMemberResponse(**member)
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Member added but details not found"
            )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid list ID"
        )


@router.get("/{list_id}/members", response_model=List[ListMemberResponse])
async def get_list_members_endpoint(
    list_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get all members of a list."""
    try:
        if not await check_list_access(list_id, current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this list"
            )
        
        members = await get_list_members(list_id)
        return [ListMemberResponse(**m) for m in members]
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid list ID"
        )


@router.delete("/{list_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_list_member_endpoint(
    list_id: str,
    user_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Remove a member from a list."""
    try:
        role = await get_user_list_role(list_id, current_user.id)
        if role != UserRole.OWNER:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the owner can remove members"
            )
        
        success = await remove_list_member(list_id, user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Member not found"
            )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID"
        )


@router.post("/{list_id}/items", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_list_item(
    list_id: str,
    item_data: ItemCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Add an item to a list."""
    try:
        if not await check_list_access(list_id, current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this list"
            )
        
        role = await get_user_list_role(list_id, current_user.id)
        if role not in [UserRole.OWNER, UserRole.EDITOR]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to add items"
            )
        
        item = await add_item_to_list(list_id, item_data)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="List not found"
            )
        
        return ItemResponse(
            id=item.id,
            name=item.name,
            notes=item.notes,
            category=item.category,
            quantity=item.quantity,
            unit_price=item.unit_price,
            currency=item.currency,
            total_price=item.total_price,
            bought=item.bought,
            bought_by=item.bought_by,
            bought_at=item.bought_at,
            created_at=item.created_at,
            updated_at=item.updated_at,
            version=item.version
        )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid list ID"
        )


@router.patch("/{list_id}/items/{item_id}", response_model=ItemResponse)
async def update_list_item_endpoint(
    list_id: str,
    item_id: str,
    item_update: ItemUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update an item in a list."""
    try:
        if not await check_list_access(list_id, current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this list"
            )
        
        role = await get_user_list_role(list_id, current_user.id)
        if role not in [UserRole.OWNER, UserRole.EDITOR]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to edit items"
            )
        
        try:
            item = await update_list_item(
                list_id=list_id,
                item_id=item_id,
                item_update=item_update,
                user_id=current_user.id
            )
            if not item:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Item not found"
                )
            
            return ItemResponse(
                id=item.id,
                name=item.name,
                notes=item.notes,
                category=item.category,
                quantity=item.quantity,
                unit_price=item.unit_price,
                currency=item.currency,
                total_price=item.total_price,
                bought=item.bought,
                bought_by=item.bought_by,
                bought_at=item.bought_at,
                created_at=item.created_at,
                updated_at=item.updated_at,
                version=item.version
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(e)
            )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID"
        )


@router.delete("/{list_id}/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_list_item_endpoint(
    list_id: str,
    item_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete an item from a list."""
    try:
        if not await check_list_access(list_id, current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have access to this list"
            )
        
        role = await get_user_list_role(list_id, current_user.id)
        if role not in [UserRole.OWNER, UserRole.EDITOR]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have permission to delete items"
            )
        
        success = await delete_list_item(list_id, item_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item not found"
            )
    except InvalidId:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid ID"
        )

