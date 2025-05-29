import os
import requests
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings

logger = logging.getLogger(__name__)

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
    scheduler = BackgroundScheduler()
    
    # Schedule the task to run daily at 2:00 AM
    scheduler.add_job(
        update_schedules_task,
        'cron',
        hour=2,
        minute=0,
        id='update_schedules_daily',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info('Background scheduler started for daily schedule updates')
    return scheduler
