from pydantic import BaseModel
from typing import List


class ActionItem(BaseModel):
    owner: str
    task: str
    deadline: str
    priority: str


class ActionItems(BaseModel):
    items: List[ActionItem]


import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def extract_action_items(transcript: str) -> ActionItems:
    prompt = f"""
You are an expert AI meeting assistant.

Extract every actionable task from the meeting transcript.

For each task identify:
- owner
- task
- deadline
- priority

Rules:
- If the owner is not explicitly mentioned, use "Unassigned".
- If the deadline is not mentioned, use "Not specified".
- Priority should be one of: Low, Medium, High.
- Do not invent tasks that are not supported by the transcript.

Meeting Transcript:
{transcript}
"""

    response = client.responses.parse(
        model="gpt-5",
        input=prompt,
        text_format=ActionItems,
    )

    return response.output_parsed