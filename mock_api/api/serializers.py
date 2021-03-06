from django.contrib.auth.models import User
import django.contrib.auth.password_validation as validators
from django.core import exceptions
from pkg_resources import require
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
    UserAnimalLikeRelation,
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
    location = LocationSerializer(required=False)
    liked_colors = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), many=True, required=False
    )
    liked_charactes = serializers.PrimaryKeyRelatedField(
        queryset=Character.objects.all(), many=True, required=False
    )
    liked_kinds = serializers.PrimaryKeyRelatedField(
        queryset=AnimalKind.objects.all(), many=True, required=False
    )
    avatar = serializers.SerializerMethodField(read_only=True)

    # liked_charactes = serializers.ModelField(Character, required=False)
    # liked_kinds = serializers.ModelField(AnimalKind, required=False)

    class Meta:
        model = UserPrefs
        fields = [
            "id",
            "has_garden",
            "description",
            "avatar",
            # boolean preferences
            "is_male",
            "likes_children",
            "likes_other_animals",
            # m2m relations
            "liked_colors",
            "liked_charactes",
            "liked_kinds",
            # additional stuff
            "location",
            "liked_animals",
            "max_range",
        ]
        read_only_fields = ["id"]

    def update(self, instance: ShelterPrefs, validated_data: dict):
        location = (
            validated_data.pop("location") if "location" in validated_data else None
        )

        super().update(instance, validated_data)

        if location is not None:
            if instance.location is None:
                instance.location = Location.objects.create(latitude=0, longitude=0)

            instance.location.latitude = location["latitude"]
            instance.location.longitude = location["longitude"]
            instance.location.save()

        instance.save()

        return instance

    def get_avatar(self, instance):
        return instance.avatar.url if instance.avatar else None


class ShelterPrefsSerializer(serializers.ModelSerializer):
    location = LocationSerializer(required=False)

    class Meta:
        model = ShelterPrefs
        fields = ["id", "description", "location"]
        read_only = ["id"]

    def get_validations_exclusions(self):
        exclusions = super(ShelterPrefsSerializer, self).get_validations_exclusions()
        return exclusions + ["location"]

    def create(self, validated_data):
        try:
            location_data = validated_data.pop("location")
        except KeyError:
            location_data = None

        shelter_prefs = ShelterPrefs.objects.create(**validated_data)
        if location_data:
            location = Location.objects.create(
                shelter_prefs=shelter_prefs, **location_data
            )

            location.save()
        shelter_prefs.location = location
        shelter_prefs.save()

        return shelter_prefs

    def update(self, instance: ShelterPrefs, validated_data):
        try:
            location = validated_data.pop("location")
        except KeyError:
            location = None

        instance.description = validated_data["description"]
        if location:
            if instance.location is None:
                instance.location = Location.objects.create(latitude=0, longitude=0)

            instance.location.latitude = location["latitude"]
            instance.location.longitude = location["longitude"]

            instance.location.save()
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
        password = validated_data.pop("password")
        user: User = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
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


class UserAnimalLikeRelationSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = UserAnimalLikeRelation
        fields = ["id", "user", "animal", "state", "name"]

    def get_name(self, serialized: UserAnimalLikeRelation):
        user: User = serialized.user.profile.user
        return f"{user.first_name} {user.last_name}"


class PersonalInfoSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    description = serializers.CharField()
    has_garden = serializers.BooleanField()

    def update_user_model(self, user: User):
        assert user.profile.user_prefs != None

        user.first_name = self["first_name"].value
        user.last_name = self["last_name"].value

        user_prefs: UserPrefs = user.profile.user_prefs
        user_prefs.description = self["description"].value
        user_prefs.has_garden = self["has_garden"].value


class AccountInfoSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(required=False, allow_null=True)

    def validate_password(self, data):
        if data is not None:
            try:
                validators.validate_password(password=data)
            except exceptions.ValidationError as e:
                raise serializers.ValidationError(list(e.messages))

        return data

    def update_user_model(self, user: User):
        assert user.profile.user_prefs != None

        new_email = self["email"].value
        new_password = self["password"].value

        if new_email != None:
            user.email = new_email

        if new_password:
            user.set_password(new_password)
