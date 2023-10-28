import os

from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'combine_mail.settings')

celery = Celery('combine_mail')
celery.config_from_object('django.conf:settings', namespace='CELERY')
celery.autodiscover_tasks()
