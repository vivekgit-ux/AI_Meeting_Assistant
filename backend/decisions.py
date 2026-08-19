from pydantic import BaseModel
from typing import List


class Decisions(BaseModel):
    decisions: List[str]


import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def extract_decisions(transcript: str) -> Decisions:
    prompt = f"""
You are an expert AI meeting assistant.

Identify all important decisions that were explicitly made during the meeting.

Rules:
- Include only actual decisions.
- Do not include general discussion or suggestions.
- Do not invent decisions.
- If no decisions were made, return an empty list.
- Write each decision as a clear, concise sentence.

Meeting Transcript:
{transcript}
"""

    response = client.responses.parse(
        model="gpt-5",
        input=prompt,
        text_format=Decisions,
    )

    return response.output_parsed