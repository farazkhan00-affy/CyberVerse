from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

SYSTEM_PROMPT = """You are CyberVerse AI, the built-in assistant for CyberVerse — an all-in-one cybersecurity platform.
CyberVerse offers these tools: Password Generator, Password Analyzer, Password Entropy Calculator, Password Policy Validator,
Hash Generator, Hash Compare, Base64/URL/HTML Encoder-Decoder, JWT Decoder, IP Lookup, DNS Lookup, WHOIS Lookup, Port Scanner,
Security Headers Checker, Robots.txt Viewer, XSS/SQLi Pattern Checker, Cookie Analyzer, CORS Analyzer, SSL Certificate Checker,
QR Code Generator, Caesar Cipher, AES Encrypt/Decrypt, and Hex/Binary Converter.
Help users understand cybersecurity concepts, guide them to the right tool on the platform when relevant, and answer general
security questions clearly and concisely. Keep answers helpful and not overly long."""


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


@router.post("/chat")
def chat(request: ChatRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="AI service is not configured")

    payload = {
       "model": "openai/gpt-oss-120b",
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}]
        + [{"role": m.role, "content": m.content} for m in request.messages],
        "temperature": 0.7,
        "max_tokens": 500,
    }

    try:
        res = requests.post(
            GROQ_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json=payload,
            timeout=30,
        )
        res.raise_for_status()
        data = res.json()
        reply = data["choices"][0]["message"]["content"]
        return {"reply": reply}
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"AI request failed: {str(e)}")