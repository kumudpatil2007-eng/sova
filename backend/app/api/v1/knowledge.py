import os
import shutil
import hashlib
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.config import settings
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.document import KnowledgeCollection, Document, DocumentChunk
from app.schemas.knowledge import (
    KnowledgeCollectionOut, DocumentOut, DocumentChunkOut,
    KnowledgeSearchRequest, KnowledgeSearchResult
)
from app.rag.chunker import document_chunker
from app.rag.retriever import local_retriever
from app.tools.ocr_tool import ocr_tool

router = APIRouter(prefix="/knowledge", tags=["Enterprise Knowledge Base"])

@router.get("/collections", response_model=List[KnowledgeCollectionOut])
async def list_collections(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(KnowledgeCollection).options(selectinload(KnowledgeCollection.documents))
    cols = (await db.execute(stmt)).scalars().all()
    
    # Auto-seed default MRPL collection if empty
    if not cols:
        col = KnowledgeCollection(
            name="MRPL Asset Integrity & Safety Standards",
            description="Official refinery operating procedures, statutory OISD guidelines, and equipment manuals.",
            department="Refinery Operations"
        )
        db.add(col)
        await db.commit()
        cols = (await db.execute(stmt)).scalars().all()
        
    return [
        KnowledgeCollectionOut(
            id=c.id,
            name=c.name,
            description=c.description,
            department=c.department,
            created_at=c.created_at,
            document_count=len(c.documents) if "documents" in c.__dict__ and c.documents else 0
        )
        for c in cols
    ]

@router.get("/documents", response_model=List[DocumentOut])
async def list_documents(
    collection_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Document).options(selectinload(Document.chunks))
    if collection_id:
        stmt = stmt.where(Document.collection_id == collection_id)
        
    docs = (await db.execute(stmt)).scalars().all()
    
    # Auto-seed default documents if empty
    if not docs:
        col_stmt = select(KnowledgeCollection)
        col = (await db.execute(col_stmt)).scalars().first()
        if not col:
            col = KnowledgeCollection(
                name="MRPL Asset Integrity & Safety Standards",
                description="Official refinery operating procedures, statutory OISD guidelines, and equipment manuals.",
                department="Refinery Operations"
            )
            db.add(col)
            await db.commit()
            await db.refresh(col)
            
        sop_file = settings.DEMO_DATA_DIR / "sops" / "MRPL_SOP_08_Pressure_Vessel_Safety.txt"
        if sop_file.exists():
            with open(sop_file, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                
            doc = Document(
                collection_id=col.id,
                filename=sop_file.name,
                title="MRPL Standard Operating Procedure SOP-08: Pressure Vessels & Heat Exchangers",
                file_type="TXT",
                file_size_bytes=len(content.encode("utf-8")),
                storage_path=str(sop_file),
                integrity_sha256=hashlib.sha256(content.encode("utf-8")).hexdigest(),
                total_pages=6
            )
            db.add(doc)
            await db.commit()
            await db.refresh(doc)
            
            chunks = document_chunker.chunk_text(content)
            for c in chunks:
                chunk_obj = DocumentChunk(
                    document_id=doc.id,
                    chunk_index=c["chunk_index"],
                    page_number=c["page_number"],
                    content=c["content"]
                )
                db.add(chunk_obj)
            await db.commit()
            
            docs = (await db.execute(stmt)).scalars().all()

    return [
        DocumentOut(
            id=d.id,
            collection_id=d.collection_id,
            filename=d.filename,
            title=d.title,
            file_type=d.file_type,
            file_size_bytes=d.file_size_bytes,
            total_pages=d.total_pages,
            uploaded_at=d.uploaded_at,
            chunk_count=len(d.chunks) if "chunks" in d.__dict__ and d.chunks else 0
        )
        for d in docs
    ]

@router.post("/search", response_model=List[KnowledgeSearchResult])
@router.post("/query", response_model=List[KnowledgeSearchResult])
async def search_knowledge(
    req: KnowledgeSearchRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    results = await local_retriever.search(
        db=db,
        query=req.query,
        top_k=req.top_k
    )
    return results
