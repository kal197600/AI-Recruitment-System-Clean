from fastapi import APIRouter

from app.services.import_service import ImportService

router = APIRouter(
    prefix="/import-email",
    tags=["Email Import"]
)


@router.post("/")
def import_email():

    service = ImportService()

    service.process_unread_emails()

    return {
        "success": True,
        "message": "Email import completed."
    }