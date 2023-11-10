import json
from math import ceil
from smtplib import SMTPDataError

from celery import shared_task
from django.core.mail import send_mail
from django.db.models import Q
from django.utils import timezone
from django_celery_beat.models import PeriodicTask, IntervalSchedule, PeriodicTasks
from rest_framework import viewsets, pagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from combine_mail.helpers import create_log
from .models import ReceiverMail, SendibleMail, SenderMailAddress
from core.serializers import SenderMailAddressSerializer, ReceiverMailSerializer
from users.models import User


def send_email_celery(receiver_mail: ReceiverMail) -> bool:
    valid_mail_q = Q(last_expired__lt=timezone.now()) | Q(last_expired__isnull=True)
    mail = receiver_mail.sendible_mail
    if mail.burst_mode == SendibleMail.BURST_MODE_SERIAL:
        sender_mail: SenderMailAddress = mail.user.sendermailaddress_set.filter(valid_mail_q).first()
    elif mail.burst_mode == SendibleMail.BURST_MODE_DISTRIBUTE:
        mail_count = mail.user.sendermailaddress_set.filter(valid_mail_q).count()
        if mail_count == 0:
            return False
        sent_count = mail.user.sent_count
        sender_mail: SenderMailAddress = mail.user.sendermailaddress_set.filter(valid_mail_q)[
            sent_count % mail_count]
    else:
        sender_mail: SenderMailAddress = mail.user.sendermailaddress_set.filter(
            valid_mail_q).order_by('?').first()
    if not sender_mail:
        return False
    try:
        send_mail(recipient_list=[receiver_mail.email_address],
                  from_email=sender_mail.email,
                  auth_user=sender_mail.email,
                  auth_password=sender_mail.password,
                  subject=mail.subject,
                  html_message=mail.body,
                  message=mail.body)
        receiver_mail.sent_time = timezone.now()
        receiver_mail.status = ReceiverMail.MAIL_STATUS_SENT
        receiver_mail.from_email = sender_mail.email
        receiver_mail.save()
        return True
    except SMTPDataError as e:
        if 'Daily user sending quota exceeded' in str(e):
            sender_mail.last_expired = timezone.now() + timezone.timedelta(minutes=sender_mail.refresh_time)
            sender_mail.save()
            return send_email_celery(receiver_mail)
    except Exception as e:
        create_log(str(e))
        return False


@shared_task
def send_next_email(user_id, job_id):
    user = User.objects.get(id=user_id)
    receiver_mail: ReceiverMail = ReceiverMail.objects.filter(
        sendible_mail__user_id=user.id,
        sent_time__isnull=True,
        status=ReceiverMail.MAIL_STATUS_PENDING).first()
    if not receiver_mail:
        PeriodicTask.objects.filter(name=job_id).delete()
        return
    receiver_mail.status = ReceiverMail.MAIL_STATUS_SENDING
    receiver_mail.save()
    if send_email_celery(receiver_mail):
        user.sent_count += 1
        user.save()
    else:
        receiver_mail.status = ReceiverMail.MAIL_STATUS_FAILED
        receiver_mail.save()


@shared_task
def retry_failed_mails():
    for user in User.objects.all():
        count = ReceiverMail.objects.filter(
            sendible_mail__user_id=user.id,
            sent_time__isnull=True,
            status=ReceiverMail.MAIL_STATUS_FAILED).count()
        if count > 0:
            mails = ReceiverMail.objects.filter(
                sendible_mail__user_id=user.id,
                sent_time__isnull=True,
                status=ReceiverMail.MAIL_STATUS_FAILED).update(status=ReceiverMail.MAIL_STATUS_PENDING)
            if not PeriodicTask.objects.filter(name=str(mails[0].sendible_mail.id)).exists():
                main_email = mails[0].sendible_mail
                schedule_mail_task(5, main_email)
    return True


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_mass_mail(request: Request):
    data = request.data
    subject = data.get('subject')
    body = data.get('body')
    burst_mode = data.get('burst_mode')
    emails = data.get('emails')
    delay = data.get('delay')
    if not subject:
        return Response(status=400, data={'subject': 'Subject is required'})
    if not body:
        return Response(status=400, data={'body': 'Body is required'})
    if not burst_mode:
        return Response(status=400, data={'burst_mode': 'Burst mode is required'})
    if burst_mode not in [x[0] for x in SendibleMail.BURST_MODE_CHOICES]:
        return Response(status=400, data={
            'burst_mode': f'{burst_mode} is not a valid burst mode.'
                          f' Valid modes are {[x[0] for x in SendibleMail.BURST_MODE_CHOICES]}'
        })
    if not emails:
        return Response(status=400, data={'emails': 'Emails are required'})
    if delay is None:
        return Response(status=400, data={'delay': 'Delay is required'})
    if not isinstance(delay, int) or delay <= 0:
        return Response(status=400, data={'delay': 'Delay must be a positive integer'})
    delay = ceil(delay / 1000)
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
    bulk_create.reverse()
    ReceiverMail.objects.bulk_create(bulk_create)

    schedule_mail_task(delay, main_email)

    return Response(status=201, data={'message': 'Emails are being sent'})


def schedule_mail_task(delay, main_email):
    schedule, created = IntervalSchedule.objects.get_or_create(every=delay, period=IntervalSchedule.SECONDS)
    periodic_task = PeriodicTask()
    periodic_task.interval = schedule
    periodic_task.name = f'{main_email.id}'
    periodic_task.task = 'core.views.send_next_email'
    periodic_task.args = json.dumps([main_email.user.id, main_email.id])
    periodic_task.save()
    PeriodicTasks.update_changed()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_mail_api(request: Request):
    data = request.data
    subject = data.get('subject')
    body = data.get('body')
    email = data.get('email')
    if not subject or not body or not email:
        return Response(status=400, data={'message': 'subject, body and email are required'})
    sendible_mail = SendibleMail.objects.create(user=request.user, subject=subject, body=body)
    ReceiverMail.objects.create(sendible_mail=sendible_mail, email_address=email)
    schedule_mail_task(5, sendible_mail)
    return Response(status=201, data={'message': 'Email is being sent'})


class SenderMailViewSet(viewsets.ModelViewSet):
    serializer_class = SenderMailAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return SenderMailAddress.objects.filter(user=user)


class ReceiverMailViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReceiverMailSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = pagination.LimitOffsetPagination

    def get_queryset(self):
        user = self.request.user
        return ReceiverMail.objects.filter(sendible_mail__user=user).order_by('-sent_time')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request: Request):
    user = request.user
    total_delivered = ReceiverMail.objects.filter(
        sendible_mail__user=user,
        status=ReceiverMail.MAIL_STATUS_DELIVERED).count()
    total_sent = ReceiverMail.objects.filter(
        sendible_mail__user=user,
        status=ReceiverMail.MAIL_STATUS_SENT).count()
    total_pending = ReceiverMail.objects.filter(
        sendible_mail__user=user,
        status=ReceiverMail.MAIL_STATUS_PENDING).count()
    total_failed = ReceiverMail.objects.filter(
        sendible_mail__user=user,
        status=ReceiverMail.MAIL_STATUS_FAILED).count()
    return Response({
        'sent_count': total_sent + total_delivered,
        'pending_count': total_pending,
        'delivered_count': total_delivered,
        'failed_count': total_failed,
        'template_count': SendibleMail.objects.filter(user=user).count(),
        'sender_count': SenderMailAddress.objects.filter(user=user).count(),
    }, status=200)
