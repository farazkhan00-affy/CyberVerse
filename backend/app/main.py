import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.database import engine, Base
from app.models import user
from app.routers import auth_routes, web_tools, ai_chat, contact, oauth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CyberVerse API")

# FIX 1: Explicit secret key with session params for localhost cookie persistence
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "cyberverse-super-secret-key-12345"),
    session_cookie="session",
    https_only=False,
    same_site="lax"
)

# FIX 2: Correct CORS settings with credentials allowed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(web_tools.router)
app.include_router(ai_chat.router)
app.include_router(contact.router)
app.include_router(oauth.router)

@app.get("/health")
def health():
    return {"status": "CyberVerse backend running"}