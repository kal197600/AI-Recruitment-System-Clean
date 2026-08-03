from io import BytesIO

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, Spacer, SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors


def generate_pdf(report_type: str, report_data: dict) -> BytesIO:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    title = report_data.get("title", "Report")
    elements.append(Paragraph(title, styles["Title"]))
    elements.append(Spacer(1, 12))

    if report_type == "dashboard":
        summary = report_data.get("summary", {})
        rows = [
            ["Metric", "Value"],
            ["Total Candidates", summary.get("total_candidates", 0)],
            ["Total Jobs", summary.get("total_jobs", 0)],
            ["Total Applications", summary.get("total_applications", 0)],
            ["Total Screenings", summary.get("total_screenings", 0)],
        ]
        table = Table(rows, hAlign="LEFT")
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ]
            )
        )
        elements.append(table)
    else:
        rows = report_data.get("rows", [])
        if rows:
            headers = list(rows[0].keys())
            table_data = [headers] + [list(item.values()) for item in rows]
        else:
            table_data = [["No data available"]]

        table = Table(table_data, hAlign="LEFT")
        table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), colors.lightgrey),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ]
            )
        )
        elements.append(table)

    doc.build(elements)
    buffer.seek(0)
    return buffer
