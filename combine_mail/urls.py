from django.contrib import admin
from django.shortcuts import render
from django.urls import path, include, re_path


def index(request):
    return render(request, 'index.html')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('core/', include('core.urls')),
    re_path(r'.*', index),
]
