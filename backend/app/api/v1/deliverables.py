import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.config import settings

router = APIRouter(prefix="/deliverables", tags=["Deliverables Download"])

@router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = settings.GENERATED_DIR / filename
    if not file_path.exists():
        # Fallback check in upload or demo directory
        file_path = settings.DEMO_DATA_DIR / filename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Requested sovereign deliverable not found.")

    media_type = "application/octet-stream"
    if filename.endswith(".docx"):
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    elif filename.endswith(".pptx"):
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    elif filename.endswith(".xlsx"):
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    elif filename.endswith(".pdf"):
        media_type = "application/pdf"

    return FileResponse(
        path=str(file_path),
        filename=filename,
        media_type=media_type
    )
