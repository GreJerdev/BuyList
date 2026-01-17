from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.mongodb import close_database
from app.api import auth, users, lists, assist

app = FastAPI(title=settings.app_name, debug=settings.debug)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(lists.router)
app.include_router(assist.router)


@app.on_event("shutdown")
async def shutdown_event():
    await close_database()


@app.get("/")
async def root():
    return {"message": "Buy List API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

