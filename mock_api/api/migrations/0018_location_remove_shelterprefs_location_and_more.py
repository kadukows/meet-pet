# Generated by Django 4.0.3 on 2022-04-23 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_animal_shelter'),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=8)),
            ],
        ),
        migrations.RemoveField(
            model_name='shelterprefs',
            name='location',
        ),
        migrations.RemoveField(
            model_name='userprefs',
            name='location',
        ),
        migrations.AddField(
            model_name='shelterprefs',
            name='description',
            field=models.TextField(default=''),
        ),
    ]