from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from api.views import UserViewSet


router = routers.DefaultRouter()
router.register(r"user", UserViewSet)


urlpatterns = [path("", include(router.urls)), path("get_token/", obtain_auth_token)]
