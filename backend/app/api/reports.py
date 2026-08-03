from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["reports"],
)

SUPPORTED_REPORT_TYPES = {
    "dashboard",
    "candidates",
    "jobs",
    "applications",
    "screening",
}

SUPPORTED_FORMATS = {
    "pdf",
    "excel",
}

@router.get("/export")
def export_report(
    type: str = Query(..., description="Report type"),
    format: str = Query(..., description="Export format"),
    db: Session = Depends(get_db),
):
    report_type = type.lower()
    report_format = format.lower()

    if report_type not in SUPPORTED_REPORT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported report type: {type}",
        )

    if report_format not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported format: {format}",
        )

    try:
        file_buffer, media_type = ReportService().export_report(
            report_type=report_type,
            file_format=report_format,
            db=db,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    extension = "pdf" if report_format == "pdf" else "xlsx"
    filename = f"report-{report_type}.{extension}"
    file_buffer.seek(0)

    return StreamingResponse(
        file_buffer,
        media_type=media_type,
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
        },
    )
