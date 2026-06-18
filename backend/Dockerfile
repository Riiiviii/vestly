FROM python:3.12-slim AS builder

COPY --from=ghcr.io/astral-sh/uv:0.11.19 /uv /uvx /usr/local/bin/

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

FROM python:3.12-slim

WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
COPY . .

ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000

RUN useradd --create-home --uid 1000 appuser
USER appuser

CMD ["fastapi", "run", "main.py", "--port", "8000"]
