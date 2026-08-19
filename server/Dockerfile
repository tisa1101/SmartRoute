# Use an official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --default-timeout=1000 --no-cache-dir -r requirements.txt

# Copy the entire backend code
COPY . .

# Expose FastAPI port (Render injects PORT env var)
EXPOSE 8000

# Run FastAPI — production mode (no --reload)
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
