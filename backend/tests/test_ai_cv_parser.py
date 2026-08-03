from pathlib import Path

from app.parsers.pdf_parser import PDFParser
from app.ai.cv_parser import CVParserAI


pdf = list(
    Path("uploads/2026/07").glob("*.pdf")
)[0]

text = PDFParser().extract_text(pdf)

parser = CVParserAI()

result = parser.parse(text)

print(result)