FROM python:3.11.9-slim

# Install ffmpeg
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set workdir
WORKDIR /app

# Install uv.
COPY --from=ghcr.io/astral-sh/uv /uv /uvx /bin/

# Copy project files
COPY pyproject.toml uv.lock ./
# Install Python dependencies with uv sync
RUN uv sync --frozen --no-dev

COPY . .

# Expose port (default FastAPI/uvicorn port)
EXPOSE 8000

# Command to run the FastAPI app
CMD ["/app/.venv/bin/fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
