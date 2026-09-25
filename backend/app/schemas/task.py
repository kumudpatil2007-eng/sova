from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any, Dict
from datetime import datetime

class AgentStepOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    step_order: int
    agent_name: str
    model_used: Optional[str] = None
    tool_called: Optional[str] = None
    tool_input: Optional[Any] = None
    tool_output: Optional[Any] = None
    thought_trace: Optional[str] = None
    status: str
    created_at: datetime

class GeneratedFileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    filename: str
    file_type: str
    file_size_bytes: int
    storage_path: str
    integrity_sha256: Optional[str] = None
    created_at: datetime

class TaskCreate(BaseModel):
    title: Optional[str] = None
    prompt: str
    task_type: Optional[str] = None  # Auto-selected if None

class TaskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    title: str
    prompt: str
    task_type: str
    status: str
    assigned_model: Optional[str] = None
    attached_filename: Optional[str] = None
    result_summary: Optional[str] = None
    execution_time_seconds: float
    created_at: datetime
    completed_at: Optional[datetime] = None
    steps: List[AgentStepOut] = []
    generated_files: List[GeneratedFileOut] = []
