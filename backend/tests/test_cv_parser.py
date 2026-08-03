from app.ai.cv_parser import CVParser

parser = CVParser()

candidate = parser.parse(
    "uploads/2026/07/90e67ff8218148d9af34c7ad13fdcd16.pdf"
)

print(candidate.model_dump_json(indent=2))