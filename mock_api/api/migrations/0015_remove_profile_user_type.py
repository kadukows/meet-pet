# Generated by Django 4.0.3 on 2022-04-20 22:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_animal_randomly_generated_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='user_type',
        ),
    ]
