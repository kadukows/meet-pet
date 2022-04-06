# Generated by Django 4.0.3 on 2022-04-02 02:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_userprefs_liked_charactes_userprefs_liked_colors_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='user_type',
            field=models.CharField(choices=[('NO', 'Normal'), ('SH', 'Shelter'), ('AD', 'Admin')], default='NO', max_length=2),
        ),
        migrations.AlterField(
            model_name='userprefs',
            name='has_garden',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='userprefs',
            name='location',
            field=models.TextField(default='Some location'),
        ),
    ]