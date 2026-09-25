import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class AgentStep(Base):
    __tablename__ = "agent_steps"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(36), ForeignKey("tasks.id"), nullable=False)
    step_order = Column(Integer, nullable=False, default=1)
    agent_name = Column(String(100), nullable=False) # Planner, DocumentAgent, CodingAgent, KnowledgeAgent, SynthesizerAgent, VerificationAgent
    model_used = Column(String(100), nullable=True)
    tool_called = Column(String(100), nullable=True)
    tool_input = Column(JSON, nullable=True)
    tool_output = Column(JSON, nullable=True)
    thought_trace = Column(Text, nullable=True)
    status = Column(String(50), default="RUNNING") # RUNNING, COMPLETED, FAILED
    created_at = Column(DateTime, default=utcnow)

    task = relationship("Task", back_populates="steps")
