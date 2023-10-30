from django.core.mail import send_mail
from rest_framework import serializers

from .models import SenderMailAddress, ReceiverMail


class SenderMailAddressSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = SenderMailAddress
        fields = '__all__'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        try:
            send_mail(
                'Test',
                'Test',
                email,
                ['mahmudula2000@gmail.com'],
                False,
                email,
                password
            )
        except Exception as e:
            raise serializers.ValidationError({'password': str(e)})
        return attrs


class ReceiverMailSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(source='sendible_mail.subject', read_only=True)
    class Meta:
        model = ReceiverMail
        fields = '__all__'
