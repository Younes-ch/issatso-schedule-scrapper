# Pull base image
FROM python:3.10-alpine

# Set environment variables
ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBUG=FALSE
ENV SECRET_KEY=$SECRET_KEY
ENV TOKEN=$TOKEN
ENV ISSATSO_API_URL=$ISSATSO_API_URL
ENV PG_DATABASE=$PG_DATABASE
ENV PG_USERNAME=$PG_USERNAME
ENV PG_PASSWORD=$PG_PASSWORD
ENV PG_HOST=$PG_HOST
ENV PG_PORT=$PG_PORT

# Set work directory
WORKDIR /code

# Install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# Copy project
COPY . .

#  make the script executable
RUN chmod +x ./entrypoint.sh

# Run server
CMD ["./entrypoint.sh"]