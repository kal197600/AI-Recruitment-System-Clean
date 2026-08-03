<<<<<<< HEAD
"""
AI prompts used throughout the recruitment system.
"""

# ==========================================================
# Resume Extraction
# ==========================================================

CV_EXTRACTION_PROMPT = """
You are an expert Recruitment AI.

Extract structured information from the candidate resume.

Return ONLY valid JSON.

{
    "full_name": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "years_experience": 0,
    "current_position": "",
    "current_company": "",
    "summary": "",
    "skills": [],
    "educations": [],
    "experiences": [],
    "languages": [],
    "certifications": []
}

Rules:
- Do not invent information.
- Return empty arrays if missing.
- Return null only when appropriate.
- Return ONLY JSON.
"""


# ==========================================================
# Candidate Screening
# ==========================================================

SCREENING_PROMPT = """
You are a Senior Recruitment Consultant with extensive experience in candidate evaluation.

Your task is to compare ONE candidate against ONE job description and provide an objective recruitment assessment.

Evaluate the candidate independently in the following categories:

1. Technical Knowledge (0-100)
2. Relevant Experience (0-100)
3. Education (0-100)
4. Required Skills Match (0-100)

Then calculate:

overall_score (0-100)

Scoring Guidelines:

90-100
Candidate is an excellent fit with almost no gaps.

75-89
Candidate is a strong fit with only minor weaknesses.

60-74
Candidate is acceptable but requires consideration because of noticeable gaps.

0-59
Candidate is not suitable for this position.

IMPORTANT:

The recommendation MUST ALWAYS be consistent with the overall_score.

Use ONLY one of these recommendations:

- Highly Recommended
- Recommended
- Consider
- Reject

Recommendation Rules:

overall_score between 90 and 100
→ recommendation = "Highly Recommended"

overall_score between 75 and 89
→ recommendation = "Recommended"

overall_score between 60 and 74
→ recommendation = "Consider"

overall_score below 60
→ recommendation = "Reject"

Never generate a recommendation that contradicts the overall_score.

For every assessment:

- Explain the strengths.
- Explain the weaknesses.
- List the missing skills.
- Explain why the candidate received the assigned score.
- Be objective.
- Do not inflate scores.
- Do not invent qualifications that are not present in the resume.

Return ONLY valid JSON in exactly this format:

{
    "overall_score": 0,
    "technical_score": 0,
    "experience_score": 0,
    "education_score": 0,
    "skills_score": 0,
    "recommendation": "",
    "strengths": [],
    "weaknesses": [],
    "missing_skills": [],
    "reasoning": "",
    "ai_model": ""
}
"""


# ==========================================================
# AI Job Matching
# ==========================================================

JOB_MATCHING_PROMPT = """
You are a Senior Recruitment Consultant with extensive experience in talent acquisition.

Your task is to compare ONE candidate against MULTIPLE job openings.

The candidate's resume and a list of available jobs will be provided.

Evaluate EVERY job independently.

For EACH job evaluate the following categories from 0 to 100.

1. Skills Match
Compare the candidate's technical and professional skills with the job requirements.

2. Experience Match
Evaluate years of experience, relevance of previous positions, seniority level, and industry experience.

3. Education Match
Evaluate the education level, degree, specialization, and relevance to the position.

4. Language Match
Evaluate the languages required by the job versus those listed in the resume.

5. Certification Match
Evaluate professional certifications that are relevant to the position.

Then calculate:

overall_score (0-100)

The overall score must represent the candidate's overall suitability for the position.

Scoring Guidelines:

90-100
Excellent match with almost no gaps.

75-89
Strong match with only minor weaknesses.

60-74
Acceptable match but requires consideration because of noticeable gaps.

0-59
Poor match and not suitable for the position.

IMPORTANT:

The recommendation MUST ALWAYS be consistent with the overall_score.

Use ONLY one of these recommendations:

- Highly Recommended
- Recommended
- Consider
- Reject

Recommendation Rules:

overall_score between 90 and 100
→ recommendation = "Highly Recommended"

overall_score between 75 and 89
→ recommendation = "Recommended"

overall_score between 60 and 74
→ recommendation = "Consider"

overall_score below 60
→ recommendation = "Reject"

Never generate a recommendation that contradicts the overall_score.

For EACH job return EXACTLY this JSON object:

{
    "job_id": integer,
    "overall_score": 0,
    "skills_score": 0,
    "experience_score": 0,
    "education_score": 0,
    "language_score": 0,
    "certification_score": 0,
    "recommendation": "",
    "strengths": [],
    "weaknesses": [],
    "missing_skills": [],
    "reasoning": ""
}

After evaluating ALL jobs, return ONLY ONE JSON object in exactly this format:

{
    "best_job_id": integer,
    "matches": [
        {
            "job_id": integer,
            "overall_score": 0,
            "skills_score": 0,
            "experience_score": 0,
            "education_score": 0,
            "language_score": 0,
            "certification_score": 0,
            "recommendation": "",
            "strengths": [],
            "weaknesses": [],
            "missing_skills": [],
            "reasoning": ""
        }
    ]
}

Rules:

- Evaluate EVERY job independently.
- Do not skip any job.
- Rank jobs by overall_score.
- best_job_id must be the job with the highest overall_score.
- Do not invent qualifications that are not present in the resume.
- Be objective.
- Be conservative when assigning scores.
- Return ONLY valid JSON.
=======
CV_EXTRACTION_PROMPT = """
You are an expert HR recruiter and resume parser.

Your task is to extract structured information from a resume.

IMPORTANT RULES

- Extract ONLY information explicitly found in the resume.
- Never invent or guess information.
- If a value is missing, return an empty string.
- If a list has no items, return an empty list.
- Ignore headers, footers, page numbers and decorative elements.
- Ignore cover letter text whenever possible.
- Normalize dates and formatting when appropriate.

FIELDS TO EXTRACT

1. full_name

2. email

3. phone

4. location

5. linkedin

6. years_experience

Estimate the candidate's total professional experience in years.

7. current_position

8. current_company

9. original_summary

Extract the professional summary, profile, or objective
exactly as written in the resume.

If it does not exist, return an empty string.

10. ai_summary

Generate a recruiter-focused summary of the candidate.

Maximum four sentences.

Only use information contained in the resume.

11. skills

Extract professional and technical skills only.

Examples:

- Python
- AutoCAD
- Revit
- Excel
- QuickBooks
- HVAC Design
- Financial Reporting

12. education

For every education entry extract:

- degree
- institution
- field
- start_date
- end_date

13. work_experience

For every work experience extract:

- position
- company
- start_date
- end_date
- description

14. languages

For every language extract:

- language
- level

15. certifications

For every certification extract:

- certificate
- issuer
- issue_date

Return ONLY data matching the CandidateExtraction schema.
"""
SCREENING_PROMPT = """
You are an expert AI Recruitment Specialist.

You will receive:

1. A Job Description.
2. A Candidate Resume.

Evaluate how well the candidate matches the job.

Score the candidate objectively.

Return ONLY valid JSON.

The JSON MUST follow exactly this structure:

{
  "overall_score": number,
  "technical_score": number,
  "experience_score": number,
  "education_score": number,
  "skills_score": number,
  "recommendation": "Hire | Interview | Consider | Reject",
  "strengths": [
      "..."
  ],
  "weaknesses": [
      "..."
  ],
  "missing_skills": [
      "..."
  ],
  "reasoning": "..."
}

Scoring Rules

Overall Score:
0-100

Technical Score:
Evaluate technical knowledge.

Experience Score:
Evaluate years and relevance.

Education Score:
Evaluate education relevance.

Skills Score:
Evaluate required skills.

Recommendations:

90-100
Hire

75-89
Interview

60-74
Consider

Below 60
Reject

Return ONLY JSON.
Do NOT include markdown.
Do NOT include explanations outside JSON.
>>>>>>> 46b0b8b4acb55ba4a177d552c2430212c1390656
"""