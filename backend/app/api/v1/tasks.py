import os
import shutil
import asyncio
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.config import settings
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.task import Task
from app.schemas.task import TaskOut, TaskCreate, GeneratedFileOut
from app.agents.orchestrator import agent_orchestrator
from app.api.websocket import ws_manager

router = APIRouter(prefix="/tasks", tags=["AI Workbench Tasks"])

@router.post("", response_model=TaskOut)
async def create_and_run_task(
    background_tasks: BackgroundTasks,
    prompt: str = Form(...),
    title: Optional[str] = Form(None),
    task_type: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    saved_file_path = None
    saved_filename = None
    
    if file:
        saved_filename = file.filename
        saved_file_path = str(settings.UPLOAD_DIR / f"{current_user.id}_{saved_filename}")
        with open(saved_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
    task = Task(
        user_id=current_user.id,
        title=title or (prompt[:50] + "..." if len(prompt) > 50 else prompt),
        prompt=prompt,
        task_type=task_type or "AUTO",
        attached_file_path=saved_file_path,
        attached_filename=saved_filename,
        status="PENDING"
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)

    # Launch workflow asynchronously in background
    async def run_async_agent(task_id: str):
        from app.core.database import AsyncSessionLocal
        async with AsyncSessionLocal() as session:
            stmt = select(Task).where(Task.id == task_id)
            t = (await session.execute(stmt)).scalar_one_or_none()
            if t:
                await agent_orchestrator.execute_task_workflow(
                    db=session,
                    task=t,
                    step_callback=lambda msg: ws_manager.broadcast_step(task_id, msg)
                )

    background_tasks.add_task(run_async_agent, task.id)

    # Return initial task state
    stmt = select(Task).where(Task.id == task.id).options(
        selectinload(Task.steps),
        selectinload(Task.generated_files)
    )
    task_with_rels = (await db.execute(stmt)).scalar_one()
    return task_with_rels

@router.get("", response_model=List[TaskOut])
async def list_user_tasks(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Task).where(Task.user_id == current_user.id).order_by(Task.created_at.desc()).options(
        selectinload(Task.steps),
        selectinload(Task.generated_files)
    )
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/files/all", response_model=List[GeneratedFileOut])
async def list_all_generated_files(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.models.generated_file import GeneratedFile
    stmt = select(GeneratedFile).order_by(GeneratedFile.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{task_id}", response_model=TaskOut)
async def get_task_details(
    task_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Task).where(Task.id == task_id).options(
        selectinload(Task.steps),
        selectinload(Task.generated_files)
    )
    result = await db.execute(stmt)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
