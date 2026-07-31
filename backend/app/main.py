from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user
from app.routers import auth_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CyberVerse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)

@app.get("/health")
def health():
    return {"status": "CyberVerse backend running"}