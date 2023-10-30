from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from users.models import User

client = APIClient()


class JWTTest(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(username='test', password='test')
        token = client.post(reverse('users:token_pair'), data={
            'username': 'test',
            'password': 'test',
        }).json()
        self.access_token = token['access']
        self.refresh_token = token['refresh']

    def test_get_token(self):
        response = client.post(reverse('users:token_pair'), data={
            'username': 'test',
            'password': 'test',
        })
        self.assertEqual(response.status_code, 200)

    def test_get_token_wrong(self):
        response = client.post(reverse('users:token_pair'), data={
            'username': 'test',
            'password': 'test1',
        })
        self.assertEqual(response.status_code, 401)

    def test_get_token_refresh(self):
        response = client.post(reverse('users:token_refresh'), data={
            'refresh': self.refresh_token,
        })
        self.assertEqual(response.status_code, 200)

    def test_get_token_refresh_wrong(self):
        response = client.post(reverse('users:token_refresh'), data={
            'refresh': self.refresh_token + '1',
        })
        self.assertEqual(response.status_code, 401)

    def test_verify_access_token(self):
        response = client.post(reverse('users:token_verify'), data={
            'token': self.access_token,
        })
        self.assertEqual(response.status_code, 200)

    def test_verify_access_token_wrong(self):
        response = client.post(reverse('users:token_verify'), data={
            'token': self.access_token + '1',
        })
        self.assertEqual(response.status_code, 401)


class OtherFunctionality(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            username='test',
            password='test',
            email='hello@kic.com'
        )

    def test_register_user(self):
        response = client.post(reverse('users:register'), data={
            'username': 'test1',
            'password': 'test1',
            'email': 'hello@kicf.com'
        })
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(username='test1')
        self.assertEqual(user.email, 'hello@kicf.com')
        self.assertEqual(user.check_password('test1'), True)

    def test_register_no_username(self):
        response = client.post(reverse('users:register'), data={
            'password': 'test1',
            'email': 'hello@gmail.com'
        })
        self.assertEqual(response.status_code, 400)

    def test_change_password(self):
        client.force_authenticate(user=self.user)
        response = client.post(reverse('users:change_password'), data={
            'new_password': 'test1',
        })
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.check_password('test1'), True)
        client.force_authenticate(user=None)

    def test_change_password_wrong(self):
        response = client.post(reverse('users:change_password'), data={
            'new_password': 'test1',
        })
        self.assertEqual(response.status_code, 401)
        self.user.refresh_from_db()
        self.assertEqual(self.user.check_password('test'), True)

    def test_reset_password(self):
        response = client.post(reverse('users:reset_password'), data={
            'email': 'hello@kic.com'
        })
        self.assertEqual(response.status_code, 200)
