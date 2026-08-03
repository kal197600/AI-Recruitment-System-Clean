from dotenv import load_dotenv
from openai import OpenAI
import os

# Load environment variables
load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

response = client.responses.create(
    model="gpt-4.1-mini",
    input="Say hello in one sentence."
)

print(response.output_text)