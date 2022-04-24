from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import (
    Animal,
    AnimalKind,
    Character,
    Location,
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


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "longitude", "latitude"]
        read_only = ["id"]


class UserPrefsSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = UserPrefs
        fields = [
            "has_garden",
            "liked_colors",
            "liked_charactes",
            "liked_kinds",
            "location",
        ]


class ShelterPrefsSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = ShelterPrefs
        fields = ["id", "description", "location"]
        read_only = ["id"]

    def create(self, validated_data):
        location_data = validated_data.pop("location")

        shelter_prefs = ShelterPrefs.objects.create(**validated_data)
        location = Location.objects.create(shelter_prefs=shelter_prefs, **location_data)

        shelter_prefs.save()

        return shelter_prefs

    def update(self, instance: ShelterPrefs, validated_data):
        location = validated_data.pop("location")

        instance.description = validated_data["description"]
        instance.location.latitude = location["latitude"]
        instance.location.longitude = location["longitude"]

        instance.save()

        return instance


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
        user.save()
        """
        profile = Profile.objects.create(
            user=user,
            user_prefs=UserPrefs.objects.create(
                has_garden=False, location="51.1161764981763, 17.037053837245473"
            ),
        )
        profile.save()
        """
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
        fields = ["id", "file", "animal", "image_url"]
        read_only = ["id", "image_url"]

    def get_image_url(self, obj):
        return obj.file.url


class AnimalWriteSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        shelter = self.context["request"].user.profile.shelter_prefs
        assert shelter is not None

        characters = validated_data.pop("characters")
        colors = validated_data.pop("colors")

        animal = Animal.objects.create(shelter=shelter, **validated_data)
        animal.save()

        animal.characters.set(characters)
        animal.colors.set(colors)
        animal.save()

        return animal

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
        ]
        read_only = ["id"]


class AnimalSerializer(serializers.ModelSerializer):
    specific_animal_kind = SpecificAnimalKindSerializer(read_only=True)
    characters = CharacterSerializer(read_only=True, many=True)
    colors = ColorSerializer(read_only=True, many=True)
    size = SizeSerializer(read_only=True)
    photos = PhotoSerializer(read_only=True, many=True)

    class Meta:
        model = Animal
        fields = [*AnimalWriteSerializer.Meta.fields, "photos", "shelter"]
        read_only = ["id"]
