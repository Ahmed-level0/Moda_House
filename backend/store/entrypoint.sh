#!/bin/bash
set -e

echo "Waiting for database..."
while ! python -c "import socket; socket.create_connection(('${DB_HOST:-db}', ${DB_PORT:-5432}), timeout=2)" 2>/dev/null; do
    sleep 1
done
echo "Database is ready!"

echo "Running migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec gunicorn store.wsgi:application --bind 0.0.0.0:8000 --workers 3 --timeout 120
