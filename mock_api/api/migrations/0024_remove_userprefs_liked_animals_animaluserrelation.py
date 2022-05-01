# Generated by Django 4.0.3 on 2022-04-29 20:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_alter_userprefs_is_male_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprefs',
            name='liked_animals',
        ),
        migrations.CreateModel(
            name='AnimalUserRelation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('PE', 'Pending'), ('AC', 'Accepted by shelter'), ('RE', 'Rejected by shelter')], default='PE', max_length=2)),
                ('animal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.animal')),
                ('user_prefs', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.userprefs')),
            ],
        ),
    ]
