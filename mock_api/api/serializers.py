from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import Profile, UserPrefs, ShelterPrefs


class UserPrefsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPrefs
        fields = ["has_garden", "location"]


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
        fields = ["username", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user: User = User.objects.create(username=validated_data["username"])
        user.set_password(validated_data["password"])
        # user.profile = validated_data["profile"]
        profile = Profile.objects.create(
            user=user,
            user_prefs=UserPrefs.objects.create(
                has_garden=False, location="51.1161764981763, 17.037053837245473"
            ),
        )
        user.save()
        profile.save()
        return user
