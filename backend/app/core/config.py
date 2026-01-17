from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    app_name: str = "Buy List API"
    debug: bool = False
    
    # MongoDB
    mongodb_url: str = "mongodb://mongodb:27017"
    mongodb_db_name: str = "buylist"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production-use-env-var"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

