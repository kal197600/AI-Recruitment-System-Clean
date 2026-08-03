from pathlib import Path

from app.parsers.pdf_parser import PDFParser


parser = PDFParser()

pdf = Path(
    "uploads/2026/07"
)

files = list(pdf.glob("*.pdf"))

if not files:

    print("No PDFs found.")

else:

    print("Testing:")

    print(files[0])

    print()

    text = parser.extract_text(files[0])

    print(text[:3000])