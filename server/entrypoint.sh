#!/bin/sh

# Wait for database to be ready (optional, but good practice)
echo "Waiting for database..."
sleep 5

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the server
echo "Starting server..."
# Use the PORT environment variable provided by Azure App Service, default to 8000
python manage.py runserver 0.0.0.0:${PORT:-8000}