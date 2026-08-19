from pydantic import BaseModel


class FollowUpEmail(BaseModel):
    subject: str
    body: str

import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_followup_email(
    summary: str,
    action_items: str,
    decisions: str,
) -> FollowUpEmail:

    prompt = f"""
You are an expert professional meeting assistant.

Generate a concise and professional follow-up email based on the
meeting information below.

The email should include:

1. A clear subject.
2. A professional greeting.
3. A short meeting summary.
4. Important decisions.
5. Action items with owners and deadlines.
6. A professional closing.

Do not invent information.

Meeting Summary:
{summary}

Action Items:
{action_items}

Decisions:
{decisions}
"""

    response = client.responses.parse(
        model="gpt-5",
        input=prompt,
        text_format=FollowUpEmail,
    )

    return response.output_parsed