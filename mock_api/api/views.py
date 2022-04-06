from django.http import HttpResponse, HttpResponseBadRequest
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
    PhotoSerializer,
    SpecificAnimalKindSerializer,
    UserSerializer,
    SizeSerializer,
)
from api.authentication import TokenBearerAuth
from api.models import (
    Animal,
    AnimalKind,
    Character,
    Color,
    Photo,
    Size,
    SpecificAnimalKind,
)


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
    permission_classes = [permissions.IsAuthenticated]


class ColorViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = ColorSerializer
    queryset = Color.objects.all()


class SizeViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = SizeSerializer
    queryset = Size.objects.all()


class CharacterViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = CharacterSerializer
    queryset = Character.objects.all()


class AnimalKindViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = AnimalKindSerializer
    queryset = AnimalKind.objects.all()


class SpecificAnimalKindViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = SpecificAnimalKindSerializer
    queryset = SpecificAnimalKind.objects.all()


class AnimalViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = AnimalSerializer
    queryset = Animal.objects.all()


class PhotoViewset(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    queryset = Photo.objects.all()
    authentication_classes = []
    permission_classes = []
