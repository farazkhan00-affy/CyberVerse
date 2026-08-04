import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")


def send_email(to_email: str, subject: str, body: str):
    if not GMAIL_ADDRESS or not GMAIL_APP_PASSWORD:
        raise Exception("Email service is not configured")

    msg = MIMEMultipart()
    msg["From"] = GMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.send_message(msg)