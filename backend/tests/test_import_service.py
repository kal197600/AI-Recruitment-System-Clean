from app.services.import_service import ImportService


def main():

    service = ImportService()

    service.process_unread_emails()


if __name__ == "__main__":
    main()