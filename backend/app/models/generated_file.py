import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class GeneratedFile(Base):
    __tablename__ = "generated_files"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String(36), ForeignKey("tasks.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False) # DOCX, PPTX, XLSX, PDF, PY
    file_size_bytes = Column(Integer, default=0)
    storage_path = Column(String(500), nullable=False)
    integrity_sha256 = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=utcnow)

    task = relationship("Task", back_populates="generated_files")
