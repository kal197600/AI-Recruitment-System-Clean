from app.database.database import SessionLocal
from app.services.imported_email_service import ImportedEmailService

db = SessionLocal()

service = ImportedEmailService(db)

print("ImportedEmailService loaded successfully.")

db.close()