import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

def utcnow():
    return datetime.now(timezone.utc)

class KnowledgeCollection(Base):
    __tablename__ = "knowledge_collections"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    department = Column(String(100), default="Refinery Operations")
    created_at = Column(DateTime, default=utcnow)

    documents = relationship("Document", back_populates="collection", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    collection_id = Column(String(36), ForeignKey("knowledge_collections.id"), nullable=True)
    filename = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False) # PDF, DOCX, TXT, CSV
    file_size_bytes = Column(Integer, default=0)
    file_hash = Column(String(64), nullable=True)
    total_pages = Column(Integer, default=1)
    storage_path = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime, default=utcnow)

    collection = relationship("KnowledgeCollection", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False, default=0)
    page_number = Column(Integer, default=1)
    content = Column(Text, nullable=False)
    embedding_json = Column(JSON, nullable=True) # Serialized vector for universal SQLite / PG fallback
    metadata_json = Column(JSON, nullable=True)

    document = relationship("Document", back_populates="chunks")
