# Generated by Django 4.0.3 on 2022-04-25 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_merge_20220425_2148'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprefs',
            name='is_male',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='userprefs',
            name='likes_children',
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name='userprefs',
            name='likes_other_animals',
            field=models.BooleanField(null=True),
        ),
    ]
