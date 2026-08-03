from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()


def ask_llm(prompt: str, model: str = "gpt-4.1-mini") -> str:
    """
    Send a prompt to OpenAI and return the response text.
    """

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not configured. Please add it to your .env file."
        )

    client = OpenAI(api_key=api_key)

    response = client.responses.create(
        model=model,
        input=prompt,
    )

    return response.output_text