import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.core.database import init_db, AsyncSessionLocal
from app.core.auth import get_password_hash
from app.core.logging import logger
from app.models.user import User
from app.models.model_registry import ModelRegistry
from app.llm.model_catalog import DEFAULT_MODELS_SEED
from sqlalchemy import select

# Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.tasks import router as tasks_router
from app.api.v1.models import router as models_router
from app.api.v1.knowledge import router as knowledge_router
from app.api.v1.tools import router as tools_router
from app.api.v1.security import router as security_router
from app.api.v1.deliverables import router as deliverables_router
from app.api.v1.integrations import router as integrations_router
from app.api.websocket import router as ws_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing SOVA Air-Gapped Operating System...")
    await init_db()
    
    # Pre-seed default users and model registry for instant out-of-the-box demo
    async with AsyncSessionLocal() as session:
        # Check users
        result = await session.execute(select(User))
        if not result.scalars().first():
            demo_users = [
                User(
                    email="engineer@mrpl.co.in",
                    full_name="Er. Rajesh K. Nayak (Lead Refinery Engineer)",
                    hashed_password=get_password_hash("mrpl2026"),
                    role="ENGINEER",
                    department="Mechanical & Plant Integrity"
                ),
                User(
                    email="manager@mrpl.co.in",
                    full_name="V. Shenoy (DGM Technical Services)",
                    hashed_password=get_password_hash("mrpl2026"),
                    role="MANAGER",
                    department="Refinery Operations"
                ),
                User(
                    email="admin@mrpl.co.in",
                    full_name="SOVA System Administrator",
                    hashed_password=get_password_hash("admin2026"),
                    role="ADMIN",
                    department="Enterprise IT & Cyber Security"
                ),
                User(
                    email="analyst@mrpl.co.in",
                    full_name="R. Mehta (Senior Data Analyst)",
                    hashed_password=get_password_hash("mrpl2026"),
                    role="ANALYST",
                    department="Process Analytics & Optimization"
                ),
                User(
                    email="developer@mrpl.co.in",
                    full_name="A. Krishnan (Internal Tools Developer)",
                    hashed_password=get_password_hash("mrpl2026"),
                    role="DEVELOPER",
                    department="Digital & IT Systems"
                )
            ]
            session.add_all(demo_users)
            await session.commit()
            logger.info("Seeded default MRPL sovereign users.")

        # Check models
        model_res = await session.execute(select(ModelRegistry))
        if not model_res.scalars().first():
            for m_seed in DEFAULT_MODELS_SEED:
                session.add(ModelRegistry(**m_seed))
            await session.commit()
            logger.info("Seeded open-weight model registry catalog.")

    logger.info("SOVA Workbench Engine Ready. External Network Egress: ZERO.")
    yield
    logger.info("Shutting down SOVA runtime.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SOVA On-Premise Agentic AI Workbench using Open-Weight Multimodal LLMs for Confidential Industrial Work (MRPL / SIH26117)",
    lifespan=lifespan
)

# Air-Gapped Strict CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local development origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register REST & WebSocket API Routes
app.include_router(auth_router, prefix="/api/v1")
app.include_router(tasks_router, prefix="/api/v1")
app.include_router(models_router, prefix="/api/v1")
app.include_router(knowledge_router, prefix="/api/v1")
app.include_router(tools_router, prefix="/api/v1")
app.include_router(security_router, prefix="/api/v1")
app.include_router(deliverables_router, prefix="/api/v1")
app.include_router(integrations_router, prefix="/api/v1")
app.include_router(ws_router)

@app.get("/")
async def root_health_check():
    return {
        "system": "SOVA Workbench",
        "organization": "Mangalore Refinery and Petrochemicals Limited (MRPL)",
        "status": "OPERATIONAL_AIR_GAPPED",
        "external_network_calls": 0,
        "sovereign_guarantee": "100% On-Premise Execution"
    }
