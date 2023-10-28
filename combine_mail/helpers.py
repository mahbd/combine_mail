from django.utils import timezone


def create_log(message: str):
    now = timezone.now()
    with open('logs.txt', 'a+') as f:
        f.write(f'{now} {message}\n')