from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class ModelRegistryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    provider: str
    capability: str
    context_length: int
    quantization: str
    vram_required_gb: float
    is_active: bool
    is_default: bool
    description: Optional[str] = None
    last_health_check: datetime

class ModelCreateRequest(BaseModel):
    id: str
    name: str
    provider: str = "Ollama (On-Premise)"
    capability: str = "REASONING"  # VISION, CODE, REASONING, GENERAL
    context_length: int = 32768
    quantization: str = "Q4_K_M"
    vram_required_gb: float = 6.0
    description: Optional[str] = None
    is_active: bool = True
    is_default: bool = False

class ModelRouteRequest(BaseModel):
    prompt: str
    has_attachment: bool = False
    attachment_mime: Optional[str] = None

class ModelRouteResponse(BaseModel):
    task_type: str
    selected_model: str
    model_capability: str
    reasoning: str
    estimated_vram_gb: float
