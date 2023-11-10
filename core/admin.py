from django.contrib import admin

from .models import SenderMailAddress, ReceiverMail, SendibleMail

admin.site.register(SendibleMail)


@admin.register(ReceiverMail)
class ReceiverMailAdmin(admin.ModelAdmin):
    actions = ['mark_as_pending']
    list_display = ('id', 'from_email', 'email_address', 'sent_time', 'status')
    list_filter = ('sendible_mail', 'status')
    search_fields = ('email_address',)

    @admin.action(description="Mark as pending")
    def mark_as_pending(self, request, queryset):
        queryset.update(status=ReceiverMail.MAIL_STATUS_PENDING)
        self.message_user(request, "Marked as pending")


@admin.register(SenderMailAddress)
class SenderMailAddressAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'email', 'last_expired')
    list_filter = ('user',)
    search_fields = ('email',)
