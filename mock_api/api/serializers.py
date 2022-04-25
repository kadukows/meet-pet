from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import (
    Animal,
    AnimalKind,
    Character,
    Photo,
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
            "id",
            "has_garden",
            "location",
            "liked_colors",
            "liked_charactes",
            "liked_kinds",
            "is_male",
            "likes_children",
            "likes_other_animals",
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
        fields = ["user_prefs", "shelter_prefs", "user_type"]


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


class PhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField("get_image_url")

    class Meta:
        model = Photo
        fields = ["id", "file", "image_url"]
        read_only = ["id", "file", "image_url"]

    def get_image_url(self, obj):
        return obj.file.url


class AnimalSerializer(serializers.ModelSerializer):
    specific_animal_kind = SpecificAnimalKindSerializer(read_only=True)
    characters = CharacterSerializer(read_only=True, many=True)
    colors = ColorSerializer(read_only=True, many=True)
    size = SizeSerializer(read_only=True)
    photos = PhotoSerializer(read_only=True, many=True)

    class Meta:
        model = Animal
        fields = [
            "id",
            "name",
            "specific_animal_kind",
            "description",
            "characters",
            "colors",
            "size",
            "male",
            "likes_child",
            "likes_other_animals",
            "photos",
        ]
        read_only = ["id"]
