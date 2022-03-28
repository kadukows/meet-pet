from lib2to3.pytree import Base
from django import views
from django.contrib.auth.models import User
from rest_framework import (
    viewsets,
    permissions,
    authentication,
    generics,
    request,
    response,
)
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from api.serializers import (
    AnimalKindSerializer,
    AnimalSerializer,
    CharacterSerializer,
    ColorSerializer,
    UserSerializer,
    SizeSerializer,
)
from api.authentication import TokenBearerAuth
from api.models import Animal, AnimalKind, Character, Color, Size, SpecificAnimalKind


class UserViewSet(viewsets.GenericViewSet, generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [
        TokenBearerAuth,
        authentication.SessionAuthentication,
    ]

    def get_permissions(self):
        if self.action == "create":
            permission_classes = []
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [p() for p in permission_classes]

    @action(methods=["get"], detail=False)
    def me(self, request: Request):
        return Response(self.get_serializer(request.user).data)


class BaseAuthPerm:
    authentication_classes = [TokenBearerAuth, authentication.SessionAuthentication]
    permissions_classes = [permissions.IsAuthenticated]


class ColorViewSet(viewsets.ModelViewSet, BaseAuthPerm):
    serializer_class = ColorSerializer
    queryset = Color.objects.all()


class SizeViewSet(viewsets.ModelViewSet, BaseAuthPerm):
    serializer_class = SizeSerializer
    queryset = Size.objects.all()


class CharacterViewSet(viewsets.ModelViewSet, BaseAuthPerm):
    serializer_class = CharacterSerializer
    queryset = Character.objects.all()


class AnimalKindViewSet(viewsets.ModelViewSet, BaseAuthPerm):
    serializer_class = AnimalKindSerializer
    queryset = AnimalKind.objects.all()


class SpecificAnimalKindViewSet(viewsets.ModelViewSet, BaseAuthPerm):
    serializer_class = SpecificAnimalKind
    queryset = SpecificAnimalKind.objects.all()


class AnimalViewSet(viewsets.ModelViewSet, BaseAuthPerm):
    serializer_class = AnimalSerializer
    queryset = Animal.objects.all()
