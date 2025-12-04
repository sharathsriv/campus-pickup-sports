from django.apps import AppConfig

class ApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "api"

    def ready(self):
        try:
            from django_q.tasks import schedule
            from django_q.models import Schedule
        except ImportError:
            return

        from django.db.utils import OperationalError

        try:
            if not Schedule.objects.filter(name="game_status_check").exists():
                schedule(
                    "api.cron.check_game_status",
                    name="game_status_check",
                    schedule_type=Schedule.MINUTES,
                    minutes=1,
                )
        except OperationalError:
            
            pass
        
        try:
            if not Schedule.objects.filter(name="upcoming_game_email").exists():
                schedule(
                    "api.cron.email_upcoming_games",
                    name="upcoming_game_email",
                    schedule_type=Schedule.MINUTES,
                    minutes=30, 
                )
        except OperationalError:
            pass
