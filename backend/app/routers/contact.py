from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter(prefix="/contact", tags=["Contact"])

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str


@router.post("/send")
def send_contact_message(request: ContactRequest):
    if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
        raise HTTPException(status_code=500, detail="Email service is not configured")

    try:
        msg = MIMEMultipart()
        msg["From"] = GMAIL_ADDRESS
        msg["To"] = GMAIL_ADDRESS
        msg["Reply-To"] = request.email
        msg["Subject"] = f"CyberVerse Contact from {request.name}"

        body = f"Name: {request.name}\nEmail: {request.email}\n\nMessage:\n{request.message}"
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
            server.send_message(msg)

        return {"status": "sent"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")