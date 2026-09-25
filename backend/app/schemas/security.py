from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class NetworkTelemetryOut(BaseModel):
    air_gap_status: str
    external_api_calls: int
    external_egress_bytes: int
    local_ai_inference_pct: float
    blocked_outbound_attempts: int
    total_local_requests: int
    uptime_seconds: int
    active_local_sockets: int
    connections: List[Dict[str, Any]]
    verified_sovereign: bool

class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: Optional[str] = None
    task_id: Optional[str] = None
    event_type: str
    actor_email: Optional[str] = None
    actor_role: Optional[str] = None
    action_details: str
    external_calls_detected: int
    ip_address: str
    timestamp: datetime
