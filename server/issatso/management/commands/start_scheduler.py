from django.core.management.base import BaseCommand
from issatso.scheduler import start_scheduler
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Start the background scheduler for updating schedules'

    def handle(self, *args, **options):
        try:
            scheduler = start_scheduler()
            self.stdout.write(self.style.SUCCESS('Background scheduler started successfully'))
            self.stdout.write('The scheduler will run daily at 2:00 AM to update schedules')
            
            # Keep the command running
            try:
                import time
                while True:
                    time.sleep(60)  # Check every minute
            except KeyboardInterrupt:
                self.stdout.write('\nShutting down scheduler...')
                scheduler.shutdown()
                self.stdout.write(self.style.SUCCESS('Scheduler stopped'))
                
        except Exception as e:
            self.stderr.write(self.style.ERROR(f'Failed to start scheduler: {str(e)}'))
