import os
import imaplib
import email

from pathlib import Path
from email.header import decode_header
from dotenv import load_dotenv

load_dotenv()


class EmailService:

    def __init__(self):

        self.imap_server = os.getenv("IMAP_SERVER")
        self.imap_port = int(os.getenv("IMAP_PORT"))
        self.email_address = os.getenv("EMAIL_ADDRESS")
        self.email_password = os.getenv("EMAIL_PASSWORD")
        self.mailbox = os.getenv("MAILBOX")

        self.connection = None

        self.allowed_extensions = {
            ".pdf",
            ".doc",
            ".docx"
        }

    # ----------------------------------------------------------

    def connect(self):

        self.connection = imaplib.IMAP4_SSL(
            self.imap_server,
            self.imap_port
        )

        self.connection.login(
            self.email_address,
            self.email_password
        )

        self.connection.select(self.mailbox)

    # ----------------------------------------------------------

    def disconnect(self):

        if self.connection:
            self.connection.logout()

    # ----------------------------------------------------------

    def get_unread_email_ids(self):

        status, messages = self.connection.search(
            None,
            "UNSEEN"
        )

        if status != "OK":
            return []

        return messages[0].split()

    # ----------------------------------------------------------

    def get_all_email_ids(self):

        status, messages = self.connection.search(
            None,
            "ALL"
        )

        if status != "OK":
            return []

        return messages[0].split()

    # ----------------------------------------------------------

    def fetch_email(self, email_id):

        status, msg_data = self.connection.fetch(
            email_id,
            "(RFC822)"
        )

        if status != "OK":
            return None

        raw_email = msg_data[0][1]

        return email.message_from_bytes(raw_email)

    # ----------------------------------------------------------

    def decode_text(self, text):

        if not text:
            return ""

        decoded_parts = decode_header(text)

        decoded_string = ""

        for part, encoding in decoded_parts:

            if isinstance(part, bytes):

                decoded_string += part.decode(
                    encoding if encoding else "utf-8",
                    errors="ignore"
                )

            else:

                decoded_string += part

        return decoded_string

    # ----------------------------------------------------------

    def get_email_info(self, message):

        return {

            "message_id": message.get("Message-ID"),

            "from": self.decode_text(
                message.get("From")
            ),

            "subject": self.decode_text(
                message.get("Subject")
            ),

            "date": message.get("Date")
        }

    # ----------------------------------------------------------

    def get_cv_attachments(self, message):

        attachments = []

        for part in message.walk():

            if part.get_content_maintype() == "multipart":
                continue

            filename = part.get_filename()

            if filename is None:
                continue

            filename = self.decode_text(filename)

            extension = Path(filename).suffix.lower()

            if extension not in self.allowed_extensions:
                continue

            payload = part.get_payload(decode=True)

            attachments.append({

                "filename": filename,

                "payload": payload,

                "content_type": part.get_content_type(),

                "size": len(payload) if payload else 0

            })

        return attachments