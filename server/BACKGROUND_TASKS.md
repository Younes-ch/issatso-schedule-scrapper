# Background Task Documentation

## Overview

The Django application now includes a background task system that automatically updates schedules daily by calling the `/api/groups/update` endpoint with the `TOKEN` environment variable as an authorization bearer token.

## Implementation Details

### Components

1. **Scheduler Module** (`issatso/scheduler.py`)
   - Contains the background task logic using APScheduler
   - Schedules daily execution at 2:00 AM
   - Handles API calls to the update endpoint

2. **Django App Configuration** (`issatso/apps.py`)
   - Automatically starts the scheduler when Django server runs
   - Only activates during `runserver` command (not during migrations or tests)

3. **Management Commands**
   - `update_schedules`: Manually trigger schedule updates
   - `start_scheduler`: Run standalone scheduler process

### Configuration

#### Environment Variables Required
```bash
TOKEN=your-issatso-api-token
BASE_URL=http://localhost  # Optional, defaults to localhost
```

#### Settings
- `BASE_URL`: Configures the base URL for internal API calls
- Logging configuration for scheduler activities

### Usage

#### Automatic Background Task
The background task starts automatically when you run:
```bash
python manage.py runserver
```

#### Manual Schedule Update
To manually trigger a schedule update:
```bash
python manage.py update_schedules
```

#### Standalone Scheduler
To run just the scheduler (useful for production):
```bash
python manage.py start_scheduler
```

### Logging

Scheduler activities are logged to:
- Console output
- `logs/scheduler.log` file

### Production Considerations

1. **Environment Variables**: Ensure `TOKEN` is properly set with a valid ISSATSO API token
2. **BASE_URL**: Set to your production domain instead of localhost
3. **Logging**: Monitor `logs/scheduler.log` for task execution status
4. **Error Handling**: The scheduler includes timeout and error handling for API calls

### Dependencies

- `APScheduler==3.10.4`: Background task scheduling
- `requests`: HTTP API calls
- Standard Django dependencies

### Task Schedule

- **Frequency**: Daily
- **Time**: 2:00 AM
- **Timeout**: 5 minutes per API call
- **Retry**: Handled by APScheduler with error logging
