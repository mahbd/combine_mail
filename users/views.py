from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import EmailValidator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request: Request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    if not username:
        return Response({'username': 'Username is required.'}, status=400)
    if not password:
        return Response({'password': 'Password is required.'}, status=400)
    if not email:
        return Response({'email': 'Email is required.'}, status=400)
    if len(username) < 3:
        return Response({'username': 'Username must be at least 3 characters.'}, status=400)
    if len(password) < 4:
        return Response({'password': 'Password must be at least 4 characters.'}, status=400)
    email_validator = EmailValidator()
    try:
        email_validator(email)
    except ValidationError as e:
        return Response({'email': str(e)}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'username': 'Username already exists.'}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({'email': 'Email already exists.'}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'User created successfully.',
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request: Request):
    new_password = request.data.get('new_password')
    if not new_password:
        return Response({'new_password': 'New password is required.'}, status=400)
    if len(new_password) < 4:
        return Response({'new_password': 'New password must be at least 4 characters.'}, status=400)
    user = request.user
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password changed successfully.'}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request: Request):
    email = request.data.get('email')
    callback = request.data.get('callback')
    if not email:
        return Response({'email': 'Email is required.'}, status=400)
    if not User.objects.filter(email=email).exists():
        return Response({'email': 'Email does not exist.'}, status=400)
    user = User.objects.get(email=email)
    refresh = RefreshToken.for_user(user)
    message = f'Go to the link to reset password. {callback}{str(refresh.access_token)}'
    html_message = (f'<p>Go to the link to reset password. '
                    f'<a href="{callback}{str(refresh.access_token)}">Click here</a></p>')
    send_mail(subject='Password Reset',
              message=message,
              html_message=html_message,
              from_email=settings.EMAIL_HOST_USER,
              recipient_list=[email], fail_silently=True)
    return Response({'message': 'Email sent successfully.'}, status=200)
