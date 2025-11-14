#!/bin/sh
set -e

# Start SSH service for Azure App Service (Alpine Linux) - must run as root
echo "Starting SSH service..."
/usr/sbin/sshd

# Wait for database to be ready (optional, but good practice)
echo "Waiting for database..."
sleep 5

# Fix ownership of app directory (needed for volume mounts in Docker)
echo "Fixing permissions..."
chown -R appuser:appuser /app

# Switch to appuser for application commands
echo "Switching to appuser for application..."

# Run database migrations as appuser
echo "Running database migrations..."
su appuser -c "python manage.py migrate --noinput"

# Collect static files as appuser
echo "Collecting static files..."
su appuser -c "python manage.py collectstatic --noinput"

# Start the server as appuser
echo "Starting server..."
# Use the PORT environment variable provided by Azure App Service, default to 8000
exec su appuser -c "python manage.py runserver 0.0.0.0:${PORT:-8000}"