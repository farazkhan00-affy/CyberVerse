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

# Production / Development environment check
IS_PRODUCTION = os.getenv("RENDER") is not None or os.getenv("ENVIRONMENT") == "production"

# FIX 1: Session Middleware with production-ready settings
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "cyberverse-super-secret-key-12345"),
    session_cookie="session",
    https_only=IS_PRODUCTION,  # Production mein HTTPS strictly required hota hai
    same_site="lax" if not IS_PRODUCTION else "none"  # Cross-origin authentication ke liye
)

# FIX 2: Correct CORS settings including Vercel Production Domain
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://cyber-verse-eta.vercel.app",  # Aapka Vercel Frontend Domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(web_tools.router)
app.include_router(ai_chat.router)
app.include_router(contact.router)
app.include_router(oauth.router)

# Root route to fix 404 error on direct backend URL
@app.get("/")
def read_root():
    return {"message": "Welcome to CyberVerse API"}

@app.get("/health")
def health():
    return {"status": "CyberVerse backend running"}