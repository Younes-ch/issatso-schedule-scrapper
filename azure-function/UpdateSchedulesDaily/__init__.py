import logging
import os
import requests
import azure.functions as func
from datetime import datetime, timezone


def main(mytimer: func.TimerRequest) -> None:
    """
    Azure Function triggered daily at 2:00 AM to update schedules.
    
    This function calls the /api/groups/update endpoint with TOKEN authentication
    to trigger schedule updates in the Django application.
    """
    # Get current UTC timestamp
    utc_timestamp = datetime.now(timezone.utc).isoformat()
    
    # Log when function is triggered
    if mytimer.past_due:
        logging.warning(f'The timer is past due! Current time: {utc_timestamp}')
    else:
        logging.info(f'Timer triggered at: {utc_timestamp}')
    
    # Get configuration from environment variables
    token = os.getenv('TOKEN')
    api_base_url = os.getenv('API_BASE_URL', 'https://win-nerkech-api.azurewebsites.net')
    # Validate TOKEN is set
    if not token:
        logging.error('TOKEN environment variable is not set.')
        return
    
    # Construct API endpoint URL
    url = f'{api_base_url}/api/groups/update'
    headers = {
        'Authorization': f'Bearer {token}',
        'Accept': 'application/json',
        'User-Agent': 'AzureFunction-ScheduleUpdater/1.0'
    }
    
    try:
        logging.info(f'Calling {url} to update schedules...')
        
        # Make the API call with 5 minute timeout
        response = requests.get(url, headers=headers, timeout=300)
        
        # Log the response
        if response.status_code == 200:
            logging.info('Schedules updated successfully')
            try:
                logging.info(f'Response: {response.json()}')
            except Exception:
                logging.info(f'Response text: {response.text}')
        else:
            logging.error(
                f'Failed to update schedules. '
                f'Status code: {response.status_code}, '
                f'Response: {response.text}'
            )
            
    except requests.Timeout:
        logging.error('Request timed out after 5 minutes')
    except requests.RequestException as e:
        logging.error(f'Request error: {str(e)}')
    except Exception as e:
        logging.error(f'Unexpected error updating schedules: {str(e)}')
