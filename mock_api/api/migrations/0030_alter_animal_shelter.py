# Generated by Django 4.0.3 on 2022-05-31 19:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0029_merge_0024_userprefs_max_range_0028_userprefs_avatar'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animal',
            name='shelter',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='animals', to='api.shelterprefs'),
        ),
    ]
