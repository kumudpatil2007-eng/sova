from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.auth import get_current_user
from app.models.user import User
from app.tools.registry import tool_registry

router = APIRouter(prefix="/tools", tags=["Tool Registry & Sandboxes"])

class ToolExecRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]

@router.get("")
async def list_tools(current_user: User = Depends(get_current_user)):
    return tool_registry.list_tools()

@router.post("/execute")
async def execute_tool(
    req: ToolExecRequest,
    current_user: User = Depends(get_current_user)
):
    result = await tool_registry.execute_tool(req.tool_name, req.arguments)
    return result
