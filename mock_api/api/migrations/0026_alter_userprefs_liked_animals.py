# Generated by Django 4.0.3 on 2022-04-30 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_userprefs_liked_animals'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprefs',
            name='liked_animals',
            field=models.ManyToManyField(related_name='liked_by', through='api.AnimalUserRelation', to='api.animal'),
        ),
    ]
