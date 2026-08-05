import os
import traceback
from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

from app.database import SessionLocal
from app.models.user import User
from app.auth import create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["OAuth"])

# FIX 3: DB Session Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth = OAuth()

oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

oauth.register(
    name="github",
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email"},
)

FRONTEND_URL = "http://localhost:5173"

def get_or_create_user(db: Session, email: str, name: str, provider: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if user:
        return user
    new_user = User(
        name=name,
        email=email,
        password_hash=None,
        oauth_provider=provider,
        is_verified=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = "http://localhost:8000/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
        userinfo = token.get("userinfo")
        if not userinfo:
            return RedirectResponse(f"{FRONTEND_URL}/login?error=oauth_failed")

        email = userinfo["email"]  
        name = userinfo.get("name", email.split("@")[0])  

        user = get_or_create_user(db, email, name, "google")  
        
        user_role = getattr(user, "role", "user")
        access_token = create_access_token(data={"sub": user.email, "role": user_role})  
        refresh_token = create_refresh_token(data={"sub": user.email, "role": user_role})  

        return RedirectResponse(f"{FRONTEND_URL}/oauth-success?token={access_token}&refresh={refresh_token}")  
    except Exception:  
        traceback.print_exc()  
        return RedirectResponse(f"{FRONTEND_URL}/login?error=oauth_failed")

@router.get("/github/login")
async def github_login(request: Request):
    redirect_uri = "http://localhost:8000/auth/github/callback"
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/github/callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.github.authorize_access_token(request)
        resp = await oauth.github.get("user", token=token)
        profile = resp.json()

        email = profile.get("email")  
        if not email:  
            emails_resp = await oauth.github.get("user/emails", token=token)  
            emails = emails_resp.json()  
            primary = next((e for e in emails if e.get("primary")), emails[0] if emails else None)  
            email = primary["email"] if primary else None  

        if not email:  
            return RedirectResponse(f"{FRONTEND_URL}/login?error=no_email")  

        name = profile.get("name") or profile.get("login")  

        user = get_or_create_user(db, email, name, "github")  
        
        user_role = getattr(user, "role", "user")
        access_token = create_access_token(data={"sub": user.email, "role": user_role})  
        refresh_token = create_refresh_token(data={"sub": user.email, "role": user_role})  

        return RedirectResponse(f"{FRONTEND_URL}/oauth-success?token={access_token}&refresh={refresh_token}")  
    except Exception:  
        traceback.print_exc()  
        return RedirectResponse(f"{FRONTEND_URL}/login?error=oauth_failed")