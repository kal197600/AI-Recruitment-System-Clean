import mimetypes
import os
import uuid

from datetime import datetime
from pathlib import Path

from supabase import create_client


class StorageService:

    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_KEY")
        self.bucket = os.getenv("SUPABASE_BUCKET")

        missing = [
            name
            for name, value in (
                ("SUPABASE_URL", self.supabase_url),
                ("SUPABASE_KEY", self.supabase_key),
                ("SUPABASE_BUCKET", self.bucket),
            )
            if not value
        ]

        if missing:
            raise RuntimeError(
                "Supabase storage configuration is missing: "
                + ", ".join(missing)
            )

        self.client = create_client(
            self.supabase_url,
            self.supabase_key,
        )

    # ---------------------------------------------------------

    def save_attachment(self, attachment):
        if "filename" not in attachment or "payload" not in attachment:
            raise ValueError(
                "Attachment must include 'filename' and 'payload'."
            )

        original_name = attachment["filename"]
        payload = attachment["payload"]

        if not isinstance(payload, (bytes, bytearray)):
            raise ValueError("Attachment payload must be bytes.")

        extension = Path(original_name).suffix.lower()

        unique_name = f"{uuid.uuid4().hex}{extension}"

        today = datetime.utcnow()
        remote_path = f"{today.year}/{today.month:02d}/{unique_name}"

        content_type = mimetypes.guess_type(original_name)[0] or "application/octet-stream"

        try:
            self.client.storage.from_(self.bucket).upload(
                remote_path,
                bytes(payload),
                {
                    "content-type": content_type,
                    "upsert": "false",
                },
            )
        except Exception as exc:
            raise RuntimeError(
                f"Failed to upload attachment '{original_name}' to Supabase Storage: {exc}"
            ) from exc

        try:
            public_url_result = (
                self.client.storage
                .from_(self.bucket)
                .get_public_url(remote_path)
            )
        except Exception as exc:
            raise RuntimeError(
                f"Attachment uploaded but failed to get public URL for '{remote_path}': {exc}"
            ) from exc

        if isinstance(public_url_result, dict):
            public_url = (
                public_url_result.get("publicURL")
                or public_url_result.get("publicUrl")
                or ""
            )
        else:
            public_url = str(public_url_result)

        if not public_url:
            raise RuntimeError(
                f"Attachment uploaded but Supabase returned an empty public URL for '{remote_path}'."
            )

        return {
            "original_filename": original_name,
            "stored_filename": unique_name,
            "filepath": public_url,
            "extension": extension,
            "size": len(payload),
        }