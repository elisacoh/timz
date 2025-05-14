test:
	pytest --cov=app --cov-report=term-missing

coverage:
	pytest --cov=app --cov-report=html
	open htmlcov/index.html

format:
	black app tests

lint:
	flake8 app tests

check: lint test

migrate:
	alembic upgrade head
