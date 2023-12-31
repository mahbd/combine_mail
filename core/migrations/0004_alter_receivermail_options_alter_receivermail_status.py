# Generated by Django 4.2.6 on 2023-10-30 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_receivermail_from_email'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='receivermail',
            options={'ordering': ['-id']},
        ),
        migrations.AlterField(
            model_name='receivermail',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('sent', 'Sent'), ('sending', 'Sending'), ('delivered', 'Delivered'), ('failed', 'Failed')], default='pending', max_length=255),
        ),
    ]
