from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from dotenv import load_dotenv
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env.dev"
print(f"DEBUG ENV_PATH = {ENV_PATH}")
print(f"Exists: {ENV_PATH.exists()}")

print(f"📂 Checking .env.dev at {ENV_PATH}")
print(f"📂 Found: {ENV_PATH.exists()}")

load_dotenv(dotenv_path=ENV_PATH)

class Settings(BaseSettings):
    environment: str
    database_url: str
    jwt_secret: str
    access_token_expire_minutes: int
    refresh_token_expire_days: int
    stripe_api_key: Optional[str] = None
    sendgrid_api_key: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env.dev",
        extra="allow",
    )

@lru_cache()
def get_settings():
    print("📦 get_settings() called")
    return Settings()



