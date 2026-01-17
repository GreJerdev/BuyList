from fastapi import APIRouter

from app.models.schemas import CategorySuggestionRequest, CategorySuggestionResponse
from app.services.model_service import model_service

router = APIRouter(prefix="/assist", tags=["assist"])


@router.post("/suggest-category", response_model=CategorySuggestionResponse)
async def suggest_category(request: CategorySuggestionRequest):
    """
    Suggest a category for an item using ML models.
    
    This endpoint demonstrates the model_service integration.
    When ML models are added to /models, they will be automatically loaded and used.
    """
    category = model_service.suggest_category(
        item_name=request.item_name,
        notes=request.notes
    )
    return CategorySuggestionResponse(category_suggestion=category)

