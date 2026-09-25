from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.model_registry import ModelRegistry
from app.models.user import User
from app.schemas.model import ModelRegistryOut, ModelRouteRequest, ModelRouteResponse, ModelCreateRequest
from app.agents.router import model_router
from app.llm.model_catalog import DEFAULT_MODELS_SEED

router = APIRouter(prefix="/models", tags=["Model Registry & Router"])

@router.get("", response_model=List[ModelRegistryOut])
async def list_models(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ModelRegistry)
    models = (await db.execute(stmt)).scalars().all()
    
    # Auto-seed if registry table is empty
    if not models:
        for seed in DEFAULT_MODELS_SEED:
            m = ModelRegistry(**seed)
            db.add(m)
        await db.commit()
        models = (await db.execute(stmt)).scalars().all()
        
    return models

@router.post("", response_model=ModelRegistryOut)
@router.post("/register", response_model=ModelRegistryOut)
async def register_model(
    req: ModelCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Registers a new open-weight model dynamically into the SOVA Model Registry.
    Satisfies PS-26117 requirement C5: Extensible architecture without code changes.
    """
    # Check if ID already exists
    existing = (await db.execute(select(ModelRegistry).where(ModelRegistry.id == req.id))).scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Model with ID '{req.id}' is already registered.")

    new_model = ModelRegistry(
        id=req.id,
        name=req.name,
        provider=req.provider,
        capability=req.capability,
        context_length=req.context_length,
        quantization=req.quantization,
        vram_required_gb=req.vram_required_gb,
        description=req.description,
        is_active=req.is_active,
        is_default=req.is_default,
        last_health_check=datetime.now(timezone.utc)
    )
    db.add(new_model)
    await db.commit()
    await db.refresh(new_model)
    return new_model

@router.post("/route", response_model=ModelRouteResponse)
async def dry_run_route(
    req: ModelRouteRequest,
    current_user: User = Depends(get_current_user)
):
    routing = model_router.route_task(
        prompt=req.prompt,
        filename="attachment.pdf" if req.has_attachment else None,
        mime_type=req.attachment_mime
    )
    return routing
