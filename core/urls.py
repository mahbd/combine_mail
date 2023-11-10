from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

app_name = 'core'
router = DefaultRouter()
router.register('sender-mail', views.SenderMailViewSet, basename='sender_mail')
router.register('sent-mail', views.ReceiverMailViewSet, basename='sent-mail')

urlpatterns = [
    path('', include(router.urls)),
    path('send-single-mail/', views.send_mail_api, name='send_single_mail'),
    path('send-mail/', views.send_mass_mail, name='send_mail'),
    path('user-stats/', views.user_stats, name='user_stats'),
]
