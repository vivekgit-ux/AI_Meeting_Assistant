import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def summarize_meeting(transcript: str) -> str:
    prompt = f"""
You are an expert AI meeting assistant.

Analyze the following meeting transcript and create a concise, professional meeting summary.

Include these sections:

1. Executive Summary
2. Key Discussion Points
3. Decisions Made
4. Risks or Concerns
5. Next Steps

Meeting Transcript:
{transcript}
"""

    response = client.responses.create(
        model="gpt-5",
        input=prompt,
    )

    return response.output_text