from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from api.views import (
    AnimalKindViewSet,
    AnimalViewSet,
    CharacterViewSet,
    ColorViewSet,
    SizeViewSet,
    SpecificAnimalKindViewSet,
    UserViewSet,
)


router = routers.DefaultRouter()
router.register(r"user", UserViewSet)
router.register(r"colors", ColorViewSet)
router.register(r"sizes", SizeViewSet)
router.register(r"characters", CharacterViewSet)
router.register(r"animals", AnimalViewSet)
router.register(r"animal_kinds", AnimalKindViewSet)
router.register(r"specific_animal_kinds", SpecificAnimalKindViewSet)


urlpatterns = [path("", include(router.urls)), path("get_token/", obtain_auth_token)]
