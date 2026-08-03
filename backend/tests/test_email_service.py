from app.services.email_service import EmailService

service = EmailService()

service.connect()

emails = service.get_unread_email_ids()

print(f"Unread emails: {len(emails)}")

if emails:

    message = service.fetch_email(emails[0])

    print()
    print(service.get_email_info(message))
    print()

    attachments = service.get_cv_attachments(message)

    print("=" * 60)
    print(f"Attachments Found: {len(attachments)}")
    print("=" * 60)

    for attachment in attachments:

        print(f"Filename : {attachment['filename']}")
        print(f"Type     : {attachment['content_type']}")
        print(f"Size     : {attachment['size']} bytes")
        print("-" * 60)

service.disconnect()