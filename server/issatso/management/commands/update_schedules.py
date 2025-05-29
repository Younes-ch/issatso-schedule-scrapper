from django.core.management.base import BaseCommand
from django.conf import settings
import os
import requests

class Command(BaseCommand):
    help = 'Calls the /api/groups/update endpoint with the TOKEN as Bearer token.'

    def handle(self, *args, **options):
        token = os.getenv('TOKEN')
        if not token:
            self.stderr.write(self.style.ERROR('TOKEN environment variable not set.'))
            return
        
        # Use the BASE_URL from settings or default to localhost
        base_url = getattr(settings, 'BASE_URL', 'http://localhost')
        url = f'{base_url}/api/groups/update'
        headers = {'Authorization': f'Bearer {token}'}
        
        try:
            self.stdout.write(f'Calling {url} to update schedules...')
            response = requests.get(url, headers=headers, timeout=300)  # 5 minute timeout
            self.stdout.write(self.style.SUCCESS(f'Status code: {response.status_code}'))
            if response.status_code == 200:
                self.stdout.write(self.style.SUCCESS('Schedules updated successfully'))
                self.stdout.write(str(response.json()))
            else:
                self.stderr.write(self.style.ERROR(f'Failed to update schedules: {response.text}'))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Error: {str(e)}'))
