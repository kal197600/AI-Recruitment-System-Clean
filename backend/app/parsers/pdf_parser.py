import io

import pdfplumber
import requests


class PDFParser:

    @staticmethod
    def _is_remote_path(file_path: str) -> bool:
        return str(file_path).startswith(("http://", "https://"))

    def extract_text(self, file_path):

        print("===== NEW PDF PARSER LOADED =====")
        print(f"File: {file_path}")
        print(f"Remote: {self._is_remote_path(file_path)}")

        text = ""

        try:
            if self._is_remote_path(file_path):
                response = requests.get(file_path, timeout=30)
                response.raise_for_status()

                pdf_stream = io.BytesIO(response.content)
                pdf_stream.seek(0)

                pdf_context = pdfplumber.open(pdf_stream)
            else:
                pdf_context = pdfplumber.open(file_path)
        except requests.RequestException as exc:
            raise ValueError(
                f"Failed to download PDF from URL '{file_path}': {exc}"
            ) from exc
        except Exception as exc:
            raise ValueError(
                f"Failed to open PDF '{file_path}': {exc}"
            ) from exc

        with pdf_context as pdf:

            for page in pdf.pages:

                page_text = page.extract_text()

                if page_text:

                    text += page_text

                    text += "\n"

        return text