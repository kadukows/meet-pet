from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User


# we need one-to-one link to exsiting User model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_prefs = models.OneToOneField("UserPrefs", null=True, on_delete=models.CASCADE)
    shelter_prefs = models.OneToOneField(
        "ShelterPrefs", null=True, on_delete=models.CASCADE
    )

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(user_prefs__isnull=False) | Q(shelter_prefs__isnull=False),
                name="either_user_prefs_or_shelter_prefs_must_not_be_null",
            )
        ]


class UserPrefs(models.Model):
    has_garden = models.BooleanField(null=False)
    location = models.TextField(null=False)


class ShelterPrefs(models.Model):
    location = models.TextField(null=False)
