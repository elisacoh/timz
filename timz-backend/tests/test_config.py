from app.core.config import get_settings

def test_env_loaded():
    settings = get_settings()
    assert settings.database_url.startswith("postgresql://")
    assert len(settings.jwt_secret) > 10

def test_settings_cached():
    s1 = get_settings()
    s2 = get_settings()
    assert s1 is s2
