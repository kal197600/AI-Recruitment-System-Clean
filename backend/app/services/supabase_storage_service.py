import os
import uuid
from datetime import datetime

from supabase import create_client


class SupabaseStorageService:

    def __init__(self):

        self.client = create_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_KEY"),
        )

        self.bucket = os.getenv("SUPABASE_BUCKET")

    def upload(self, local_file_path, original_filename):

        extension = original_filename.split(".")[-1]

        filename = f"{uuid.uuid4().hex}.{extension}"

        today = datetime.utcnow()

        remote_path = (
            f"{today.year}/"
            f"{today.month:02d}/"
            f"{filename}"
        )

        with open(local_file_path, "rb") as f:

            self.client.storage.from_(self.bucket).upload(
                remote_path,
                f,
                file_options={
                    "content-type": "application/pdf"
                },
            )

        public_url = (
            self.client.storage
            .from_(self.bucket)
            .get_public_url(remote_path)
        )

        return {
            "filepath": public_url,
            "stored_filename": filename,
            "original_filename": original_filename,
        }