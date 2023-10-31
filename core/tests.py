import json

from django.test import TestCase
from django.urls import reverse
from model_bakery import baker
from rest_framework.test import APIClient

from users.models import User
from .models import SenderMailAddress, ReceiverMail, SendibleMail

client = APIClient()


class SenderMailTest(TestCase):
    def setUp(self) -> None:
        self.user = baker.make(User)
        self.user2 = baker.make(User)
        self.mail1 = baker.make(SenderMailAddress, user=self.user)
        self.mail2 = baker.make(SenderMailAddress, user=self.user2)

    def test_create_sender_mail(self):
        client.force_authenticate(user=self.user)
        res = client.post(reverse("core:sender_mail-list"), data={
            "email": "hello@test.com",
            "password": "hello"})
        self.assertEqual(res.status_code, 201)
        count = SenderMailAddress.objects.filter(user=self.user).count()
        self.assertEqual(count, 2)
        client.logout()

    def test_get_send_mail(self):
        client.force_authenticate(user=self.user)
        res = client.get(reverse("core:sender_mail-list"))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 1)
        client.logout()

    def test_get_send_mail_unauthorized(self):
        res = client.get(reverse("core:sender_mail-list"))
        self.assertEqual(res.status_code, 401)

    def test_update_sender_mail(self):
        client.force_authenticate(user=self.user)
        res = client.patch(reverse("core:sender_mail-detail", args=[self.mail1.id]), data={
            "password": "hjfsdfk"
        })
        self.assertEqual(res.status_code, 200)
        client.logout()

    def test_update_sender_mail_other_user(self):
        client.force_authenticate(user=self.user2)
        res = client.patch(reverse("core:sender_mail-detail", args=[self.mail1.id]), data={
            "password": "hjfsdfk"
        })
        self.assertEqual(res.status_code, 404)
        client.logout()

    def test_delete_sender_mail(self):
        client.force_authenticate(user=self.user)
        res = client.delete(reverse("core:sender_mail-detail", args=[self.mail1.id]), data={
            "password": "hjfsdfk"
        })
        self.assertEqual(res.status_code, 204)
        client.logout()

    def test_delete_sender_mail_other_user(self):
        client.force_authenticate(user=self.user2)
        res = client.delete(reverse("core:sender_mail-detail", args=[self.mail1.id]), data={
            "password": "hjfsdfk"
        })
        self.assertEqual(res.status_code, 404)
        client.logout()


class SendibleMailTest(TestCase):
    def setUp(self) -> None:
        self.user = baker.make(User)
        self.user2 = baker.make(User)
        self.mail1 = baker.make(SenderMailAddress, user=self.user)
        self.mail2 = baker.make(SenderMailAddress, user=self.user2)
        baker.make(SenderMailAddress, user=self.user, _quantity=5)

    def test_create_sendible_mail_serial(self):
        client.force_authenticate(user=self.user)
        res = client.post(reverse("core:send_mail"), data=json.dumps({
            "subject": "Hello",
            "body": "Hello",
            "burst_mode": "serial",
            "emails": [
                "test1@abc.com",
                "test2@abc.com",
                "test3@abc.com",
            ],
            "delay": 10,
        }), content_type="application/json")
        self.assertEqual(res.status_code, 201, res.content)
        self.assertEqual(ReceiverMail.objects.filter(sendible_mail__user=self.user).count(), 3)
        client.logout()


class OtherTest(TestCase):
    def setUp(self) -> None:
        self.user = baker.make(User)
        self.user2 = baker.make(User)
        baker.make(SenderMailAddress, user=self.user, _quantity=10)
        baker.make(SenderMailAddress, user=self.user2, _quantity=5)
        sm = baker.make(SendibleMail, user=self.user, _quantity=5)
        sm2 = baker.make(SendibleMail, user=self.user2, _quantity=4)
        for s in sm:
            baker.make(ReceiverMail, sendible_mail=s, _quantity=10)
        for s in sm2:
            baker.make(ReceiverMail, sendible_mail=s, _quantity=8)

    def test_get_stats(self):
        client.force_authenticate(user=self.user)
        res = client.get(reverse("core:user_stats"))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["sent_count"], 0)
        self.assertEqual(res.json()["delivered_count"], 0)
        self.assertEqual(res.json()["template_count"], 5)
        self.assertEqual(res.json()["sender_count"], 10)
        client.logout()
