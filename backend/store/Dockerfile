# syntax=docker/dockerfile:1

FROM python:3.12-slim

# Prevents Python from writing .pyc files and enables unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for psycopg2
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Copy and prepare entrypoint script
COPY entrypoint.sh /entrypoint.sh
<<<<<<< HEAD
RUN chmod +x /entrypoint.sh
=======
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh
>>>>>>> 13ea9d4e313b079d8240cd666d6ac666b2615818

# Create media directory
RUN mkdir -p /app/media

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
