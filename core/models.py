from django.db import models

from users.models import User


class SenderMail(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    refresh_time = models.IntegerField(default=24 * 60)
    last_expired = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.email


class Email(models.Model):
    BURST_MODE_SERIAL = 'serial'
    BURST_MODE_DISTRIBUTE = 'distribute'
    BURST_MODE_RANDOM = 'random'

    BURST_MODE_CHOICES = (
        (BURST_MODE_SERIAL, 'Serial'),
        (BURST_MODE_DISTRIBUTE, 'Distribute'),
        (BURST_MODE_RANDOM, 'Random'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    body = models.TextField()
    burst_mode = models.CharField(max_length=255, choices=BURST_MODE_CHOICES, default=BURST_MODE_SERIAL)


class ReceiverMail(models.Model):
    email = models.ForeignKey(Email, on_delete=models.CASCADE)
    email_address = models.EmailField()
    sent_time = models.DateTimeField(null=True, blank=True)
    is_sending = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)

    def __str__(self):
        return self.email_address
