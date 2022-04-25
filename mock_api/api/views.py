from random import randint, choice as random_choice
from django.contrib.auth.models import User
from rest_framework import (
    viewsets,
    permissions,
    authentication,
    generics,
    status,
    serializers,
    pagination,
)
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from django_filters import rest_framework as filters
from api.serializers import (
    AnimalKindSerializer,
    AnimalSerializer,
    AnimalWriteSerializer,
    CharacterSerializer,
    ColorSerializer,
    PhotoSerializer,
    ShelterPrefsSerializer,
    SpecificAnimalKindSerializer,
    UserSerializer,
    UserPrefsSerializer,
    SizeSerializer,
)
from api.authentication import TokenBearerAuth
from api.models import (
    Animal,
    AnimalKind,
    Character,
    Color,
    Photo,
    ShelterPrefs,
    Size,
    SpecificAnimalKind,
    UserPrefs,
)
from api.filters import AnimalFilter
from api.permissions import IsAdmin, IsShelter, OrPermission


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


class ShelterPreferencesViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    # authentication_classes = [TokenBearerAuth, authentication.SessionAuthentication]
    serializer_class = ShelterPrefsSerializer
    queryset = ShelterPrefs.objects.all()


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


class MyPagination(pagination.LimitOffsetPagination):
    default_limit = 50
    max_limit = 100


class AnimalViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    queryset = Animal.objects.all()
    filterset_class = AnimalFilter
    filter_backends = (filters.DjangoFilterBackend,)
    pagination_class = MyPagination

    # list_permissions = [permissions.IsAuthenticated()]
    # list_actions = ("list", "retrieve", "next", "like")
    # edit_permissions = [OrPermission(IsShelter(), IsAdmin())]

    """
    def get_permissions(self):
        if self.action in self.list_actions:
            return self.list_permissions

        return self.edit_permissions
    """

    def get_serializer_class(self):
        if self.action == "create" or self.action == "update":
            return AnimalWriteSerializer

        return AnimalSerializer

    @action(methods=["post"], detail=False, serializer_class=serializers.Serializer)
    def next(self, request):
        if Animal.objects.count() == 0:
            return Response(
                data={"error": "No Animals in db"}, status=status.HTTP_400_BAD_REQUEST
            )

        user_prefs: UserPrefs = self.request.user.profile.user_prefs

        if user_prefs.prev_animal is None:
            return self.returnAndSetAnimal(user_prefs, Animal.objects.first())

        """
        smallest_id = Animal.objects.order_by("id").first().id
        largest_id = Animal.objects.order_by("-id").first().id
        random_id = randint(smallest_id, largest_id)

        animal = Animal.objects.filter(id__gte=random_id).first()
        """

        animal = random_choice(Animal.objects.all())

        if animal is None:
            return self.returnAndSetAnimal(user_prefs, Animal.objects.first())

        return self.returnAndSetAnimal(user_prefs, animal)

    @action(methods=["get"], detail=False, pagination_class=None)
    def shelters(self, request):
        return Response(
            data=self.get_serializer(
                Animal.objects.filter(
                    shelter=self.request.user.profile.shelter_prefs
                ).all(),
                many=True,
            ).data
        )

    @action(methods=["post"], detail=True, serializer_class=serializers.Serializer)
    def like(self, request: Request, pk=None):
        animal = self.get_object()
        prefs: UserPrefs = request.user.profile.user_prefs
        prefs.liked_animals.add(animal)
        prefs.save()
        return Response(data={"status": "ok"}, status=status.HTTP_200_OK)

    @action(methods=["post"], detail=True, serializer_class=serializers.Serializer)
    def dislike(self, request: Request, pk=None):
        animal = self.get_object()
        prefs: UserPrefs = request.user.profile.user_prefs
        prefs.liked_animals.remove(animal)
        prefs.save()
        return Response(data={"status": "ok"}, status=status.HTTP_200_OK)

    @action(methods=["get"], detail=False)
    def liked_animals(self, request: Request):
        return Response(
            data=self.get_serializer(
                request.user.profile.user_prefs.liked_animals, many=True
            ).data,
            status=status.HTTP_200_OK,
        )

    def returnAndSetAnimal(self, user_prefs: UserPrefs, animal: Animal):
        user_prefs.prev_animal = animal.id
        user_prefs.save()
        return Response(data=AnimalSerializer(animal).data, status=status.HTTP_200_OK)


class PhotoViewset(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    queryset = Photo.objects.all()
    authentication_classes = []
    permission_classes = []


class UserPrefsViewset(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = UserPrefsSerializer
    queryset = UserPrefs.objects.all()
