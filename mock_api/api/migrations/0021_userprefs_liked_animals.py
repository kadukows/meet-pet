# Generated by Django 4.0.3 on 2022-04-24 01:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_alter_shelterprefs_location_alter_userprefs_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprefs',
            name='liked_animals',
            field=models.ManyToManyField(to='api.animal'),
        ),
    ]
