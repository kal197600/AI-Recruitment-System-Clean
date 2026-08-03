import uuid

from pathlib import Path
from datetime import datetime


class StorageService:

    def __init__(self):

        self.base_folder = Path("uploads")

        self.base_folder.mkdir(
            parents=True,
            exist_ok=True
        )

    # ---------------------------------------------------------

    def save_attachment(self, attachment):

        today = datetime.now()

        year = str(today.year)
        month = f"{today.month:02d}"

        destination = (
            self.base_folder /
            year /
            month
        )

        destination.mkdir(
            parents=True,
            exist_ok=True
        )

        original_name = attachment["filename"]

        extension = Path(original_name).suffix.lower()

        unique_name = (
            f"{uuid.uuid4().hex}{extension}"
        )

        full_path = destination / unique_name

        with open(full_path, "wb") as file:

            file.write(
                attachment["payload"]
            )

        return {

            "original_filename": original_name,

            "stored_filename": unique_name,

            "filepath": str(full_path),

            "extension": extension,

            "size": len(
                attachment["payload"]
            )

        }