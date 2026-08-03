from app.models.imported_email import ImportedEmail


class ImportedEmailService:

    def __init__(self, db):
        self.db = db

    # --------------------------------------------------

    def already_imported(self, message_id):

        return (
            self.db.query(ImportedEmail)
            .filter(
                ImportedEmail.message_id == message_id
            )
            .first()
        )

    # --------------------------------------------------

    def create_import_record(
        self,
        message_id,
        sender,
        subject,
        email_date,
        status="Imported"
    ):

        record = ImportedEmail(
            message_id=message_id,
            email_sender=sender,
            email_subject=subject,
            email_date=email_date,
            status=status
        )

        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)

        return record