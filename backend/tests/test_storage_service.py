from app.services.email_service import EmailService
from app.services.storage_service import StorageService


email_service = EmailService()
storage_service = StorageService()


email_service.connect()

emails = email_service.get_unread_email_ids()

if emails:

    message = email_service.fetch_email(
        emails[0]
    )

    attachments = email_service.get_cv_attachments(
        message
    )

    for attachment in attachments:

        result = storage_service.save_attachment(
            attachment
        )

        print(result)

email_service.disconnect()