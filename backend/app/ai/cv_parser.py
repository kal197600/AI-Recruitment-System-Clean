from pathlib import Path

from app.ai.ai_service import AIService
from app.parsers.pdf_parser import PDFParser
from app.parsers.docx_parser import DOCXParser


class CVParser:

    def __init__(self):
        self.pdf_parser = PDFParser()
        self.docx_parser = DOCXParser()
        self.ai_service = AIService()

    def parse(self, file_path):

        extension = Path(file_path).suffix.lower()

        if extension == ".pdf":
            resume_text = self.pdf_parser.extract_text(file_path)

        elif extension == ".docx":
            resume_text = self.docx_parser.extract_text(file_path)

        else:
            raise Exception(f"Unsupported resume format: {extension}")

        if not resume_text.strip():
            raise Exception("No text extracted from resume.")

        candidate = self.ai_service.parse_resume(resume_text)

        return candidate