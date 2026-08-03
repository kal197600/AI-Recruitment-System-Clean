from pathlib import Path


class FileClassifier:

    def classify(self, filename):

        name = filename.lower()

        if "cover" in name:
            return "CoverLetter"

        if "cv" in name:
            return "CV"

        if "resume" in name:
            return "CV"

        if "portfolio" in name:
            return "Portfolio"

        if "certificate" in name:
            return "Certificate"

        return "Other"