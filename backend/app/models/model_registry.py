from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime
from app.core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(String(100), primary_key=True) # e.g. "qwen2.5-coder:7b", "llama3.2-vision:11b"
    name = Column(String(255), nullable=False)
    provider = Column(String(50), default="ollama") # ollama, vllm, local-embedded
    capability = Column(String(50), nullable=False) # VISION, CODE, REASONING, GENERAL
    context_length = Column(Integer, default=32768)
    quantization = Column(String(50), default="Q4_K_M")
    vram_required_gb = Column(Float, default=5.5)
    is_active = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    last_health_check = Column(DateTime, default=utcnow)
