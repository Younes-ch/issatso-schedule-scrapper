from django.apps import AppConfig
import logging
import sys
import os

logger = logging.getLogger(__name__)

class IssatsoConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "issatso"
    
    def ready(self):
        """Start the background scheduler when Django starts"""
        # Only start scheduler if running the server (not during migrations, tests, etc.)
        if (len(sys.argv) > 1 and sys.argv[1] == 'runserver' and 
            not os.environ.get('TESTING')):
            
            # Use Django's RUN_MAIN environment variable to prevent duplicate execution
            # This variable is set by Django's auto-reloader
            if os.environ.get('RUN_MAIN'):
                try:
                    from .scheduler import start_scheduler
                    start_scheduler()
                    logger.info('Background scheduler initialized')
                except Exception as e:
                    logger.error(f'Failed to start background scheduler: {str(e)}')
            else:
                logger.info('Skipping scheduler initialization (auto-reloader main process)')
