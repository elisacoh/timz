from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pathlib import Path
from functools import lru_cache

BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env.dev"


class Settings(BaseSettings):
    environment: str = Field(..., alias="ENVIRONMENT")
    database_url: str = Field(..., alias="DATABASE_URL")
    jwt_secret: str = Field(..., alias="JWT_SECRET")
    access_token_expire_minutes: int = Field(..., alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(..., alias="REFRESH_TOKEN_EXPIRE_DAYS")
    stripe_api_key: str = Field(..., alias="STRIPE_API_KEY")
    sendgrid_api_key: str = Field(..., alias="SENDGRID_API_KEY")

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env.dev"),
        case_sensitive=True
    )

@lru_cache()
def get_settings():
    print("📦 get_settings() called")
    return Settings()



