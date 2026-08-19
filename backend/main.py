from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

from backend.transcription import transcribe_audio
from backend.summary import summarize_meeting
from backend.actions import extract_action_items
from backend.decisions import extract_decisions
from backend.email import generate_followup_email
from backend.gmail_service import send_email

import os


app = FastAPI(title="AI Meeting Assistant")


@app.get("/")
def home():
    return {"message": "AI Meeting Assistant API is running"}


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    transcript = transcribe_audio(file_path)

    return {
        "filename": file.filename,
        "transcript": transcript
    }

class TranscriptRequest(BaseModel):
    transcript: str


@app.post("/summarize")
async def summarize(request: TranscriptRequest):

    summary = summarize_meeting(request.transcript)

    return {
        "summary": summary
    }

class ActionItemsRequest(BaseModel):
    transcript: str


@app.post("/actions")
async def extract_actions(request: ActionItemsRequest):

    action_items = extract_action_items(request.transcript)

    return action_items

class DecisionsRequest(BaseModel):
    transcript: str


@app.post("/decisions")
async def extract_meeting_decisions(request: DecisionsRequest):

    decisions = extract_decisions(request.transcript)

    return decisions

class EmailRequest(BaseModel):
    recipient: str
    summary: str
    action_items: str
    decisions: str


@app.post("/generate-email")
async def generate_email(request: EmailRequest):

    email = generate_followup_email(
        request.summary,
        request.action_items,
        request.decisions,
    )

    message_id = send_email(
        request.recipient,
        email.subject,
        email.body,
    )

    return {
        "subject": email.subject,
        "body": email.body,
        "message_id": message_id,
    }

@app.post("/process-meeting")
async def process_meeting(
    recipient: str,
    file: UploadFile = File(...),
):

    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    transcript = transcribe_audio(file_path)

    summary = summarize_meeting(transcript)

    action_items = extract_action_items(transcript)

    decisions = extract_decisions(transcript)

    action_items_data = action_items.model_dump()
    decisions_data = decisions.model_dump()

    followup_email = generate_followup_email(
        summary=summary,
        action_items=str(action_items_data),
        decisions=str(decisions_data),
    )

    message_id = send_email(
    recipient,
    followup_email.subject,
    followup_email.body,
)

    return {
    "filename": file.filename,
    "transcript": transcript,
    "summary": summary,
    "action_items": action_items_data,
    "decisions": decisions_data,
    "followup_email": {
        "subject": followup_email.subject,
        "body": followup_email.body,
    },
    "email_sent": True,
    "message_id": message_id,
}