import os
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver


# we need one-to-one link to exsiting User model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_prefs = models.OneToOneField("UserPrefs", null=True, on_delete=models.CASCADE)
    shelter_prefs = models.OneToOneField(
        "ShelterPrefs", null=True, on_delete=models.CASCADE
    )
    NORMAL = "NO"
    SHELTER = "SH"
    ADMIN = "AD"
    USER_TYPE_CHOICES = [(NORMAL, "Normal"), (SHELTER, "Shelter"), (ADMIN, "Admin")]
    user_type = models.CharField(
        max_length=2, choices=USER_TYPE_CHOICES, default=NORMAL
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
        user_prefs = UserPrefs()
        user_prefs.save()
        profile = Profile(user=instance, user_prefs=user_prefs)
        profile.save()


class UserPrefs(models.Model):
    has_garden = models.BooleanField(null=False, default=False)
    location = models.TextField(null=False, default="Some location")
    liked_colors = models.ManyToManyField("Color")
    liked_charactes = models.ManyToManyField("Character")
    liked_kinds = models.ManyToManyField("AnimalKind")
    is_male = models.BooleanField(null=False, default=False)
    likes_children = models.BooleanField(null=False, default=False)
    likes_other_animals = models.BooleanField(null=False, default=False)
    prev_animal = models.IntegerField(null=True)


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

    # implementation detail
    randomly_generated = models.BooleanField(null=False, default=False)

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
    description = models.TextField(null=False, default="")
    characters = models.ManyToManyField(Character)
    colors = models.ManyToManyField(Color)
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    male = models.BooleanField(null=False)
    likes_child = models.BooleanField(null=False)
    likes_other_animals = models.BooleanField(null=False)

    # impl detail
    randomly_generated = models.BooleanField(null=False, default=False)

    def __str__(self):
        return self.name


class Photo(models.Model):
    file = models.ImageField(upload_to="api/animal_images")
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="photos")


@receiver(models.signals.post_delete, sender=Photo)
def auto_delete_photo_on_disk(sender, instance, **kwargs):
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)
