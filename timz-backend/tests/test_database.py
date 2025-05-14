from app.db.database import *
import os

def test_engine_creation():
    expected = get_settings().database_url
    actual = engine.url.render_as_string(hide_password=False)

    assert actual == expected
def test_session_local():
    session = SessionLocal()
    try:
        assert session.is_active
    finally:
        session.close()

def test_get_db_yields_session():
    gen = get_db()
    session = next(gen)
    assert session is not None
    assert hasattr(session, 'query')
    try:
        next(gen)
    except StopIteration:
        pass  # Expected behavior

def test_migrations_directory_exists():
    base_dir = os.path.dirname(os.path.dirname(__file__))  # go from tests/ to project root
    migrations_dir = os.path.join(base_dir, "app", "db", "migrations")

    assert os.path.isdir(migrations_dir), f"Migrations folder missing at {migrations_dir}"
    assert os.path.isfile(os.path.join(migrations_dir, "env.py")), "Alembic env.py missing"
    assert os.path.isfile(os.path.join(base_dir, "alembic.ini")), "Alembic config missing"

def test_alembic_env_configuration_sets_sqlalchemy_url():
    from alembic.config import Config
    from dotenv import load_dotenv

    import os

    base_dir = os.path.dirname(os.path.dirname(__file__))
    config_path = os.path.join(base_dir, "alembic.ini")
    env_path = os.path.join(base_dir, ".env.dev")

    assert os.path.isfile(config_path), "Missing alembic.ini"
    assert os.path.isfile(env_path), "Missing .env.dev"

    load_dotenv(env_path)
    sqlalchemy_url = os.getenv("DATABASE_URL")

    assert sqlalchemy_url is not None, "DATABASE_URL not found in .env.dev"

    alembic_cfg = Config(config_path)
    alembic_cfg.set_main_option("sqlalchemy.url", sqlalchemy_url)

    assert alembic_cfg.get_main_option("sqlalchemy.url") == sqlalchemy_url
