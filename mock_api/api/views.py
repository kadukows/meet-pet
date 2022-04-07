from django.http import HttpResponse, HttpResponseBadRequest
from django.contrib.auth.models import User
from rest_framework import (
    viewsets,
    permissions,
    authentication,
    generics,
    status,
    serializers,
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
    UserPrefs,
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

    @action(methods=["post"], detail=False, serializer_class=serializers.Serializer)
    def next(self, request):
        if Animal.objects.count() == 0:
            return Response(
                data={"error": "No Animals in db"}, status=status.HTTP_400_BAD_REQUEST
            )

        user_prefs: UserPrefs = self.request.user.profile.user_prefs

        if user_prefs.prev_animal is None:
            return self.returnAndSetAnimal(user_prefs, Animal.objects.first())

        animal = Animal.objects.filter(id__gt=user_prefs.prev_animal).first()
        if animal is None:
            return self.returnAndSetAnimal(user_prefs, Animal.objects.first())

        return self.returnAndSetAnimal(user_prefs, animal)

    def returnAndSetAnimal(self, user_prefs: UserPrefs, animal: Animal):
        user_prefs.prev_animal = animal.id
        user_prefs.save()
        return Response(data=AnimalSerializer(animal).data, status=status.HTTP_200_OK)


class PhotoViewset(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    queryset = Photo.objects.all()
    authentication_classes = []
    permission_classes = []
