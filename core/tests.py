from django.test import TestCase
from django.urls import reverse
from model_bakery import baker
from rest_framework.test import APIClient

from users.models import User
from .models import SenderMailAddress

client = APIClient()


class SenderMailTest(TestCase):
    def setUp(self) -> None:
        self.user = baker.make(User)
        self.user2 = baker.make(User)
        self.mail1 = baker.make(SenderMailAddress, user=self.user)
        self.mail2 = baker.make(SenderMailAddress, user=self.user2)

    def test_create_sender_mail(self):
        client.force_authenticate(user=self.user)
        res = client.post(reverse('core:sender_mail-list'), data={
            'email': 'hello@test.com',
            'password': 'hello'})
        self.assertEqual(res.status_code, 201)
        count = SenderMailAddress.objects.filter(user=self.user).count()
        self.assertEqual(count, 2)
        client.logout()

    def test_get_send_mail(self):
        client.force_authenticate(user=self.user)
        res = client.get(reverse('core:sender_mail-list'))
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.json()), 1)
        client.logout()

    def test_get_send_mail_unauthorized(self):
        res = client.get(reverse('core:sender_mail-list'))
        self.assertEqual(res.status_code, 401)

    def test_update_sender_mail(self):
        client.force_authenticate(user=self.user)
        res = client.patch(reverse('core:sender_mail-detail', args=[self.mail1.id]), data={
            'password': 'hjfsdfk'
        })
        self.assertEqual(res.status_code, 200)
        client.logout()

    def test_update_sender_mail_other_user(self):
        client.force_authenticate(user=self.user2)
        res = client.patch(reverse('core:sender_mail-detail', args=[self.mail1.id]), data={
            'password': 'hjfsdfk'
        })
        self.assertEqual(res.status_code, 404)
        client.logout()

    def test_delete_sender_mail(self):
        client.force_authenticate(user=self.user)
        res = client.delete(reverse('core:sender_mail-detail', args=[self.mail1.id]), data={
            'password': 'hjfsdfk'
        })
        self.assertEqual(res.status_code, 204)
        client.logout()

    def test_delete_sender_mail_other_user(self):
        client.force_authenticate(user=self.user2)
        res = client.delete(reverse('core:sender_mail-detail', args=[self.mail1.id]), data={
            'password': 'hjfsdfk'
        })
        self.assertEqual(res.status_code, 404)
        client.logout()
