# Generated by Django 4.0.3 on 2022-04-20 23:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_remove_profile_user_type'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='profile',
            name='either_user_prefs_or_shelter_prefs_must_not_be_null',
        ),
        migrations.AlterField(
            model_name='profile',
            name='shelter_prefs',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.shelterprefs'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='user_prefs',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.userprefs'),
        ),
        migrations.AddConstraint(
            model_name='profile',
            constraint=models.CheckConstraint(check=models.Q(('user_prefs__isnull', True), ('shelter_prefs__isnull', True), _connector='OR'), name='either_user_prefs_or_shelter_prefs_must_not_be_null'),
        ),
    ]