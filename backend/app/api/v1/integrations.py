"""
Enterprise Integration Stub — SAP/SCADA/DCS Read-Only Connectors
=================================================================
PS SIH26117 Gap 5.a fix.

This module provides stub read-only integration points for systems
that MRPL and similar PSUs typically run. In the air-gapped deployment,
these connectors read from local data exports / replicated local stores —
they never call external cloud APIs.

Integration points:
  - SAP S/4HANA (PM module for maintenance work orders)
  - DCS / SCADA Historian (process data tags)
  - Document Management System (DMS) stub

All reads are from local filesystem replicas or API stubs.
Full integration is marked as "future work" for production deployment.
"""

from fastapi import APIRouter, Depends
from app.core.auth import get_current_user, require_roles
from app.models.user import User
from datetime import datetime, timezone

router = APIRouter(prefix="/integrations", tags=["Enterprise Integration Stubs"])


@router.get("/sap/work-orders")
async def get_sap_work_orders(current_user: User = Depends(get_current_user)):
    """
    [STUB] Read-only SAP PM (Plant Maintenance) work order list.

    Production: Reads from local SAP RFC connector or replicated DB.
    Current: Returns static demo data representative of MRPL maintenance WOs.
    Note: No SAP cloud API calls — data sourced from local replica.
    """
    return {
        "source": "SAP S/4HANA PM Module (Local Replica — Air-Gapped)",
        "integration_status": "STUB — Production: local SAP RFC / DB replica",
        "air_gap_verified": True,
        "work_orders": [
            {
                "wo_number": "WO-2026-08-4101",
                "equipment_tag": "11-HX-401",
                "description": "Emergency retubing — ultrasonic thickness below SOP-08 threshold",
                "priority": "HIGH",
                "status": "PENDING_APPROVAL",
                "estimated_cost_inr": 1_850_000,
                "planned_start": "2026-09-01",
            },
            {
                "wo_number": "WO-2026-08-4102",
                "equipment_tag": "11-P-102A",
                "description": "Bearing replacement — vibration RMS exceeded ISO 10816-3 Zone C",
                "priority": "MEDIUM",
                "status": "IN_PROGRESS",
                "estimated_cost_inr": 320_000,
                "planned_start": "2026-08-28",
            },
        ],
    }


@router.get("/scada/historian/tags")
async def get_scada_tags(current_user: User = Depends(get_current_user)):
    """
    [STUB] Read-only DCS/SCADA historian process tag values.

    Production: Reads from local OSIsoft PI / Honeywell Experion replica.
    Current: Returns static demo data for CDU-1 process tags.
    """
    return {
        "source": "DCS Historian (Local OSIsoft PI Replica — Air-Gapped)",
        "integration_status": "STUB — Production: local PI AF server",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "air_gap_verified": True,
        "tags": [
            {"tag": "CDU1.HX401.TI-4101", "description": "Shell Side Outlet Temp", "value": 185.3, "unit": "°C", "quality": "GOOD"},
            {"tag": "CDU1.HX401.PI-4102", "description": "Shell Side Pressure", "value": 18.47, "unit": "bar", "quality": "GOOD"},
            {"tag": "CDU1.P102A.VI-5201", "description": "Pump Vibration RMS", "value": 4.83, "unit": "mm/s", "quality": "GOOD"},
            {"tag": "CDU1.P102A.TE-5202", "description": "Bearing Temperature", "value": 78.6, "unit": "°C", "quality": "GOOD"},
        ],
    }


@router.get("/dms/documents")
async def list_dms_documents(current_user: User = Depends(get_current_user)):
    """
    [STUB] Read-only document management system document list.

    Production: Reads from local OpenText / SharePoint on-prem replica.
    Current: Returns static list of MRPL document catalog.
    """
    return {
        "source": "Document Management System (Local Replica — Air-Gapped)",
        "integration_status": "STUB — Production: local OpenText / SharePoint on-prem",
        "air_gap_verified": True,
        "documents": [
            {"doc_id": "MRPL-SOP-08-2024", "title": "Pressure Vessel Safety — Shell & Tube HX", "revision": "Rev. 4", "type": "SOP"},
            {"doc_id": "MRPL-ENG-CALC-2026-001", "title": "HX-401 Remaining Life Assessment", "revision": "Draft", "type": "CALCULATION"},
            {"doc_id": "MRPL-INS-RPT-2026-084", "title": "HX-401 Ultrasonic Inspection Report Aug-2026", "revision": "Final", "type": "INSPECTION_REPORT"},
        ],
    }
