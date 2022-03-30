from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import (
    Animal,
    AnimalKind,
    Character,
    Profile,
    Size,
    SpecificAnimalKind,
    UserPrefs,
    ShelterPrefs,
    Color,
)


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ["id", "value"]
        read_only = ["id"]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["id", "value"]
        read_only = ["id"]


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = ["id", "value"]
        read_only = ["id"]


class AnimalKindSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnimalKind
        fields = ["id", "value"]
        read_only = ["id"]


class UserPrefsSerializer(serializers.ModelSerializer):
    # liked_colors = ColorSerializer(many=True)
    # liked_charactes = CharacterSerializer(many=True)

    class Meta:
        model = UserPrefs
        fields = [
            "has_garden",
            "location",
            "liked_colors",
            "liked_charactes",
            "liked_kinds",
        ]


class ShelterPrefsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelterPrefs
        fields = ["location"]


class ProfileSerializer(serializers.ModelSerializer):
    user_prefs = UserPrefsSerializer(read_only=True)
    shelter_prefs = ShelterPrefsSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ["user_prefs", "shelter_prefs"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["username", "password", "profile", "first_name", "last_name", "email"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user: User = User.objects.create(username=validated_data["username"])
        user.set_password(validated_data["password"])
        profile = Profile.objects.create(
            user=user,
            user_prefs=UserPrefs.objects.create(
                has_garden=False, location="51.1161764981763, 17.037053837245473"
            ),
        )
        user.save()
        profile.save()
        return user


class SpecificAnimalKindSerializer(serializers.ModelSerializer):
    animal_kind = AnimalKindSerializer(read_only=True)

    class Meta:
        model = SpecificAnimalKind
        fields = ["id", "value", "animal_kind"]
        read_only = ["id"]


class AnimalSerializer(serializers.ModelSerializer):
    specific_animal_kind = SpecificAnimalKindSerializer(read_only=True)
    characters = CharacterSerializer(read_only=True, many=True)
    colors = ColorSerializer(read_only=True, many=True)
    size = SizeSerializer(read_only=True)

    class Meta:
        model = Animal
        fields = [
            "id",
            "name",
            "specific_animal_kind",
            "characters",
            "colors",
            "size",
            "male",
            "likes_child",
            "likes_other_animals",
        ]
        read_only = ["id"]
