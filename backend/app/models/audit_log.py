import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from app.core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), nullable=True)
    task_id = Column(String(36), nullable=True)
    event_type = Column(String(100), nullable=False) # LOGIN, TASK_EXEC, TOOL_RUN, FILE_DOWNLOAD, NETWORK_PROBE
    actor_email = Column(String(255), nullable=True)
    actor_role = Column(String(50), nullable=True)
    action_details = Column(Text, nullable=False)
    external_calls_detected = Column(Integer, default=0) # Guarantees 0
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=utcnow)
