import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime
from app.core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="ENGINEER") # ADMIN, ENGINEER, MANAGER, ANALYST, DEVELOPER
    department = Column(String(100), default="Refinery Operations")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)
