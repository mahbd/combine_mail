from smtplib import SMTPDataError

from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from django_celery_beat.models import PeriodicTask, IntervalSchedule
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from combine_mail.helpers import create_log
from core.models import ReceiverMail, SendibleMail, SenderMailAddress
from core.serializers import SenderMailAddressSerializer
from users.models import User


def send_email_celery(receiver_mail):
    mail = receiver_mail.sendible_mail
    if mail.burst_mode == SendibleMail.BURST_MODE_SERIAL:
        sender_mail = mail.user.sendermail_set.first()
    elif mail.burst_mode == SendibleMail.BURST_MODE_DISTRIBUTE:
        mail_count = mail.user.sendermail_set.filter(last_expired__gt=timezone.now()).count()
        if mail_count == 0:
            return False
        sent_count = mail.user.sent_count
        sender_mail = mail.user.sendermail_set.filter(last_expired__gt=timezone.now())[sent_count % mail_count]
    else:
        sender_mail = mail.user.sendermail_set.order_by('?').first()
    if not sender_mail:
        return False
    try:
        send_mail(recipient_list=[receiver_mail.sendible_mail], from_email=sender_mail.sendible_mail,
                  auth_user=sender_mail.sendible_mail, auth_password=sender_mail.password,
                  subject=mail.subject, html_message=mail.body, message=mail.body)
        receiver_mail.sent_time = timezone.now()
        receiver_mail.save()
    except SMTPDataError as e:
        if 'Daily user sending quota exceeded' in str(e):
            sender_mail.last_expired = timezone.now() + timezone.timedelta(minutes=sender_mail.refresh_time)
            sender_mail.save()
    except Exception as e:
        create_log(str(e))
        return False


@shared_task
def send_next_email(user_id):
    user = User.objects.get(id=user_id)
    receiver_mail = ReceiverMail.objects.filter(
        email__user_id=user.id,
        sent_time__isnull=True,
        is_sending=False).first()
    if not receiver_mail:
        return
    receiver_mail.is_sending = True
    receiver_mail.save()
    if send_email_celery(receiver_mail):
        user.sent_count += 1
        user.save()
    receiver_mail.is_sending = False
    receiver_mail.save()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_mass_mail(request: Request):
    data = request.data
    subject = data.get('subject')
    body = data.get('body')
    burst_mode = data.get('burst_mode')
    emails = data.get('emails')
    delay = int(data.get('delay'))
    if not subject or not body or not burst_mode or not emails or not delay:
        print(subject, body, burst_mode, emails)
        return Response(status=400, data={'message': 'Invalid data'})
    main_email = SendibleMail()
    main_email.user = request.user
    main_email.subject = subject
    main_email.body = body
    main_email.burst_mode = burst_mode
    main_email.save()
    bulk_create = []
    for email in emails:
        receiver_mail = ReceiverMail()
        receiver_mail.sendible_mail = main_email
        receiver_mail.email_address = email
        bulk_create.append(receiver_mail)

    schedule, created = IntervalSchedule.objects.get_or_create(every=delay, period=IntervalSchedule.SECONDS)
    ReceiverMail.objects.bulk_create(bulk_create)
    periodic_task = PeriodicTask()
    periodic_task.name = f'{main_email.id}'
    periodic_task.task = 'core.views.send_next_email'
    periodic_task.interval = schedule
    periodic_task.kwargs = f'{{"user_id": {request.user.id}}}'
    periodic_task.save()

    return Response(status=200, data={'message': 'Emails are being sent'})


class SenderMailViewSet(viewsets.ModelViewSet):
    serializer_class = SenderMailAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SenderMailAddress.objects.filter(user=user)
