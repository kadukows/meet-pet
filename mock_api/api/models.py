from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.contrib.auth.models import User, Group
from django.dispatch import receiver
from django.forms import BooleanField


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


@receiver(post_save, sender=User)
def add_user_to_normal_group(sender, instance: User, created, **kwargs):
    if created:
        instance.groups.add(Group.objects.get(name="Normal"))


class UserPrefs(models.Model):
    has_garden = models.BooleanField(null=False)
    location = models.TextField(null=False)
    liked_colors = models.ManyToManyField("Color")
    liked_charactes = models.ManyToManyField("Character")
    liked_kinds = models.ManyToManyField("AnimalKind")


class ShelterPrefs(models.Model):
    location = models.TextField(null=False)


class Color(models.Model):
    value = models.TextField(null=False, unique=True)

    def __str__(self):
        return self.value


class Size(models.Model):
    value = models.TextField(null=False, unique=True)

    def __str__(self):
        return self.value


class Character(models.Model):
    value = models.TextField(null=False, unique=True)

    def __str__(self):
        return self.value


class SpecificAnimalKind(models.Model):
    value = models.TextField(null=False, unique=True)
    animal_kind = models.ForeignKey("AnimalKind", on_delete=models.CASCADE)

    def __str__(self):
        return self.value


class AnimalKind(models.Model):
    value = models.TextField(null=False, unique=True)

    def __str__(self):
        return self.value


class Animal(models.Model):
    name = models.TextField(null=False)
    specific_animal_kind = models.ForeignKey(
        "SpecificAnimalKind", on_delete=models.CASCADE
    )
    characters = models.ManyToManyField(Character)
    colors = models.ManyToManyField(Color)
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    male = models.BooleanField(null=False)
    likes_child = models.BooleanField(null=False)
    likes_other_animals = models.BooleanField(null=False)

    def __str__(self):
        return self.name
