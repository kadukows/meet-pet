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
router.register(r"my_photos", PhotoViewset)


urlpatterns = [
    path("", include(router.urls)),
    path("get_token/", obtain_auth_token),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
