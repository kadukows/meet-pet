from email.mime import base
import os
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from api.views import (
    AnimalKindViewSet,
    AnimalViewSet,
    CharacterViewSet,
    ColorViewSet,
    PhotoViewset,
    ShelterPreferencesViewSet,
    SizeViewSet,
    SpecificAnimalKindViewSet,
    UserAnimalLikeRelationViewset,
    UserDetailByUserPrefsIdViewset,
    UserViewSet,
    UserPrefsViewset,
)


router = routers.DefaultRouter()
router.register(r"user", UserViewSet)
router.register(r"colors", ColorViewSet)
router.register(r"sizes", SizeViewSet)
router.register(r"characters", CharacterViewSet)
router.register(r"animals", AnimalViewSet)
router.register(r"animal_kinds", AnimalKindViewSet)
router.register(r"specific_animal_kinds", SpecificAnimalKindViewSet)
router.register(r"my_photos", PhotoViewset)
router.register(r"shelter_preferences", ShelterPreferencesViewSet)
router.register(r"user_preferences", UserPrefsViewset)
router.register(r"user_animal_like_rel", UserAnimalLikeRelationViewset)
router.register(
    r"user_detail_shelter",
    UserDetailByUserPrefsIdViewset,
    basename="user_detail_shelter",
)

urlpatterns = [
    path("", include(router.urls)),
    path("get_token/", obtain_auth_token),
] + static(settings.MEDIA_URL, document_root=os.path.join(settings.MEDIA_ROOT, "api"))
