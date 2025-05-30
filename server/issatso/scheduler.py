import os
import requests
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.base import JobLookupError
from django.conf import settings

logger = logging.getLogger(__name__)

# Use a module-level scheduler instance
scheduler = None

def update_schedules_task():
    """Background task to update schedules by calling the API endpoint"""
    try:
        token = os.getenv('TOKEN')
        if not token:
            logger.error('TOKEN environment variable not set.')
            return
        
        # Use localhost or the configured host
        base_url = getattr(settings, 'BASE_URL', 'http://localhost')
        url = f'{base_url}/api/groups/update'
        headers = {'Authorization': f'Bearer {token}'}
        
        logger.info(f'Calling {url} to update schedules')
        response = requests.get(url, headers=headers, timeout=300)  # 5 minute timeout
        
        if response.status_code == 200:
            logger.info('Schedules updated successfully')
        else:
            logger.error(f'Failed to update schedules. Status code: {response.status_code}')
            
    except Exception as e:
        logger.error(f'Error updating schedules: {str(e)}')

def start_scheduler():
    """Start the background scheduler"""
    global scheduler
    
    # Check if scheduler is already running
    if scheduler is not None and scheduler.running:
        logger.info('Scheduler already running, skipping initialization')
        return scheduler
    
    # Create new scheduler instance
    scheduler = BackgroundScheduler()
    
    # Check if the job already exists to prevent duplicates
    try:
        existing_job = scheduler.get_job('update_schedules_daily')
        if existing_job:
            logger.info('Job already exists, removing before adding new one')
            scheduler.remove_job('update_schedules_daily')
    except JobLookupError:
        # Job doesn't exist, which is fine
        pass
    
    # Schedule the task to run daily at 2:00 AM (production)
    # For testing: uncomment the line below to run every 5 minutes
    # scheduler.add_job(update_schedules_task, 'interval', minutes=5, id='update_schedules_test', replace_existing=True)
    
    scheduler.add_job(
        update_schedules_task,
        'cron',
        hour=11,
        minute=19,
        id='update_schedules_daily',
        replace_existing=True,
        max_instances=1  # Ensure only one instance of the job runs at a time
    )
    
    scheduler.start()
    logger.info('Background scheduler started for daily schedule updates')
    return scheduler
