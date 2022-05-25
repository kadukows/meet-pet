import os
from pydoc import describe
from this import d
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver


# we need one-to-one link to exsiting User model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_prefs = models.OneToOneField(
        "UserPrefs", null=True, on_delete=models.CASCADE, blank=True
    )
    shelter_prefs = models.OneToOneField(
        "ShelterPrefs", null=True, on_delete=models.CASCADE, blank=True
    )

    def is_normal_user(self):
        return self.user_prefs != None

    def is_shelter(self):
        return self.shelter_prefs != None

    def is_admin(self):
        return self.user_prefs == None and self.shelter_prefs == None

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(user_prefs__isnull=True) | Q(shelter_prefs__isnull=True),
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


class Location(models.Model):
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitude = models.DecimalField(max_digits=8, decimal_places=6)


class UserPrefs(models.Model):
    # things about a person
    has_garden = models.BooleanField(null=False, default=False)
    description = models.TextField(null=False, default="")
    location: Location = models.OneToOneField(
        Location,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="user_prefs",
    )

    # I guess
    liked_colors = models.ManyToManyField("Color")
    liked_charactes = models.ManyToManyField("Character")
    liked_kinds = models.ManyToManyField("AnimalKind")
    # liked_specific_kinds = models.ManyToManyField('SpecificAnimalKind')
    is_male = models.BooleanField(null=True)
    likes_children = models.BooleanField(null=True)
    likes_other_animals = models.BooleanField(null=True)

    prev_animal = models.IntegerField(null=True)

    liked_animals = models.ManyToManyField("Animal", through="UserAnimalLikeRelation")


class ShelterPrefs(models.Model):
    location: Location = models.OneToOneField(
        Location,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="shelter_prefs",
    )
    description = models.TextField(null=False, default="")


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
    shelter = models.ForeignKey(
        ShelterPrefs, on_delete=models.DO_NOTHING, null=True, default=None
    )

    # impl detail
    randomly_generated = models.BooleanField(null=False, default=False)

    def __str__(self):
        return self.name


class Photo(models.Model):
    file = models.ImageField(upload_to="api/animal_images")
    animal = models.ForeignKey(Animal, on_delete=models.CASCADE, related_name="photos")


class UserAnimalLikeRelation(models.Model):
    user: UserPrefs = models.ForeignKey(UserPrefs, on_delete=models.CASCADE)
    animal: Animal = models.ForeignKey(Animal, on_delete=models.CASCADE)

    LIKED = "LI"
    NOT_ACCEPTED = "NO"
    ACCEPTED = "AC"
    STATE_CHOICES = [
        (LIKED, "Liked"),
        (NOT_ACCEPTED, "Not accepted"),
        (ACCEPTED, "Accepted"),
    ]
    state = models.CharField(
        max_length=2, choices=STATE_CHOICES, null=False, default=LIKED
    )


@receiver(models.signals.post_delete, sender=Photo)
def auto_delete_photo_on_disk(sender, instance, **kwargs):
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)
