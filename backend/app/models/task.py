import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    prompt = Column(Text, nullable=False)
    task_type = Column(String(50), default="MULTIMODAL_DOC") # MULTIMODAL_DOC, CODE_EXEC, RAG_SEARCH, REPORT_GEN, GENERAL
    status = Column(String(50), default="PENDING") # PENDING, PLANNING, RUNNING, COMPLETED, FAILED
    assigned_model = Column(String(100), nullable=True)
    attached_file_path = Column(String(500), nullable=True)
    attached_filename = Column(String(255), nullable=True)
    result_summary = Column(Text, nullable=True)
    execution_time_seconds = Column(Float, default=0.0)
    created_at = Column(DateTime, default=utcnow)
    completed_at = Column(DateTime, nullable=True)

    steps = relationship("AgentStep", back_populates="task", cascade="all, delete-orphan", order_by="AgentStep.step_order")
    generated_files = relationship("GeneratedFile", back_populates="task", cascade="all, delete-orphan")
