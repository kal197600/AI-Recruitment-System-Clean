import pdfplumber


class PDFParser:

    def extract_text(self, pdf_path):

        text = ""

        with pdfplumber.open(pdf_path) as pdf:

            for page in pdf.pages:

                page_text = page.extract_text()

                if page_text:

                    text += page_text

                    text += "\n"

        return text