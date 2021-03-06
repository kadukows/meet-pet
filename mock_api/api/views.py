import os
from random import choice as random_choice
from django.contrib.auth.models import User
from pkg_resources import require
from rest_framework import (
    viewsets,
    permissions,
    authentication,
    generics,
    status,
    serializers,
    pagination,
    mixins,
)
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters import rest_framework as filters
from api.serializers import (
    AccountInfoSerializer,
    AnimalKindSerializer,
    AnimalSerializer,
    AnimalWriteSerializer,
    CharacterSerializer,
    ColorSerializer,
    PersonalInfoSerializer,
    PhotoSerializer,
    ShelterPrefsSerializer,
    SpecificAnimalKindSerializer,
    UserAnimalLikeRelationSerializer,
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
    UserAnimalLikeRelation,
    UserPrefs,
)
from api.filters import AnimalFilter
from api.permissions import IsAdmin, IsNormalUser, IsShelter, OrPermission


class AvatarSerializer(serializers.Serializer):
    avatar = serializers.ImageField()


class UserViewSet(viewsets.GenericViewSet, generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [
        TokenBearerAuth,
        authentication.SessionAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == "create":
            return []

        return super().get_permissions()

    @action(methods=["get"], detail=False)
    def me(self, request: Request):
        return Response(self.get_serializer(request.user).data)

    @action(
        methods=["post"],
        detail=False,
        serializer_class=AvatarSerializer,
        permission_classes=[IsNormalUser],
    )
    def upload_photo(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if self.request.user.profile.user_prefs.avatar:
                os.remove(self.request.user.profile.user_prefs.avatar.path)
            self.request.user.profile.user_prefs.avatar = request.data["avatar"]
            self.request.user.profile.user_prefs.save()
            return Response(
                UserSerializer(self.request.user).data, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        methods=["delete"],
        detail=False,
        serializer_class=serializers.Serializer,
        permission_classes=[IsNormalUser],
    )
    def delete_avatar(self, request):
        user_prefs: UserPrefs = self.request.user.profile.user_prefs

        if user_prefs.avatar:
            os.remove(user_prefs.avatar.path)
        user_prefs.avatar = None
        user_prefs.save()

        return Response(status=status.HTTP_200_OK)

    @action(
        methods=["post"],
        detail=False,
        serializer_class=PersonalInfoSerializer,
        permission_classes=[IsNormalUser],
    )
    def update_personal_info(self, request: Request):
        serializer: PersonalInfoSerializer = PersonalInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update_user_model(request.user)
            request.user.profile.user_prefs.save()
            request.user.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        methods=["post"],
        detail=False,
        serializer_class=AccountInfoSerializer,
        permission_classes=[IsNormalUser],
    )
    def update_account_info(self, request: Request):
        serializer: AccountInfoSerializer = AccountInfoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.update_user_model(request.user)
            request.user.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BaseAuthPerm:
    authentication_classes = [TokenBearerAuth, authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class ShelterPreferencesViewSet(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = ShelterPrefsSerializer
    queryset = ShelterPrefs.objects.all()

    def get_queryset(self):
        if self.action == "list" or self.action == "retrieve":
            return super().get_queryset()

        return ShelterPrefs.objects.filter(profile__user=self.request.user).all()


class ColorViewSet(BaseAuthPerm, viewsets.ReadOnlyModelViewSet):
    serializer_class = ColorSerializer
    queryset = Color.objects.all()


class SizeViewSet(BaseAuthPerm, viewsets.ReadOnlyModelViewSet):
    serializer_class = SizeSerializer
    queryset = Size.objects.all()


class CharacterViewSet(BaseAuthPerm, viewsets.ReadOnlyModelViewSet):
    serializer_class = CharacterSerializer
    queryset = Character.objects.all()


class AnimalKindViewSet(BaseAuthPerm, viewsets.ReadOnlyModelViewSet):
    serializer_class = AnimalKindSerializer
    queryset = AnimalKind.objects.all()


class SpecificAnimalKindViewSet(BaseAuthPerm, viewsets.ReadOnlyModelViewSet):
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

    def get_permissions(self):
        if self.action == "create":
            return [IsShelter()]

        return super().get_permissions()

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

    @action(
        methods=["post"],
        detail=True,
        serializer_class=serializers.Serializer,
        permission_classes=[IsNormalUser],
    )
    def like(self, request: Request, pk=None):
        animal = self.get_object()
        prefs: UserPrefs = request.user.profile.user_prefs
        prefs.liked_animals.add(animal)
        prefs.save()
        return Response(status=status.HTTP_200_OK)

    @action(
        methods=["post"],
        detail=True,
        serializer_class=serializers.Serializer,
        permission_classes=[IsNormalUser],
    )
    def dislike(self, request: Request, pk=None):
        animal = self.get_object()
        prefs: UserPrefs = request.user.profile.user_prefs
        rel: UserAnimalLikeRelation = UserAnimalLikeRelation.objects.filter(
            user__profile__user=request.user, animal=animal
        ).first()

        if rel is not None:
            if rel.state != UserAnimalLikeRelation.LIKED:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        prefs.liked_animals.remove(animal)
        prefs.save()

        return Response(status=status.HTTP_200_OK)

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


class PhotoViewset(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    queryset = Photo.objects.all()
    permission_classes = [IsShelter]

    def get_queryset(self):
        if (
            self.action != "list"
            and self.request.user.profile.shelter_prefs is not None
        ):
            our_animals = self.request.user.profile.shelter_prefs.animals
            return Photo.objects.filter(animal__in=our_animals.all()).all()

        return super().get_queryset()

    def get_permissions(self):
        if self.action == "list":
            return []

        return super().get_permissions()


class UserPrefsViewset(BaseAuthPerm, viewsets.ModelViewSet):
    serializer_class = UserPrefsSerializer
    queryset = UserPrefs.objects.all()

    def get_queryset(self):
        if self.request.user.profile.is_normal_user():
            # self.request.user.profile.user_prefs
            return UserPrefs.objects.filter(profile__user=self.request.user).all()

        # shelters should see all
        return super().get_queryset()

    def get_permissions(self):
        if self.action != "list":
            return [IsNormalUser()]

        return super().get_permissions()


class UserAnimalLikeRelationViewset(BaseAuthPerm, viewsets.ReadOnlyModelViewSet):
    serializer_class = UserAnimalLikeRelationSerializer
    queryset = UserAnimalLikeRelation.objects.all()

    def get_queryset(self):
        user_prefs = self.request.user.profile.user_prefs
        shelter_prefs = self.request.user.profile.shelter_prefs

        if user_prefs is not None:
            return UserAnimalLikeRelation.objects.filter(
                user=self.request.user.profile.user_prefs
            ).all()
        else:
            shelters_animals = Animal.objects.filter(shelter=shelter_prefs)

            return UserAnimalLikeRelation.objects.filter(
                animal__in=shelters_animals
            ).all()

    @action(methods=["post"], detail=True, permission_classes=[IsShelter])
    def accept(self, request: Request, pk=None):
        instance: UserAnimalLikeRelation = self.get_object()
        instance.state = UserAnimalLikeRelation.ACCEPTED
        instance.save()
        return Response(self.get_serializer(instance).data)

    @action(methods=["post"], detail=True, permission_classes=[IsShelter])
    def not_accept(self, request: Request, pk=None):
        instance: UserAnimalLikeRelation = self.get_object()
        instance.state = UserAnimalLikeRelation.NOT_ACCEPTED
        instance.save()
        return Response(self.get_serializer(instance).data)


class UserDetailByUserPrefsIdViewset(
    BaseAuthPerm,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsShelter]
    serializer_class = UserSerializer
    queryset = UserPrefs.objects.all()

    def get_object(self):
        userPrefsInstance = generics.RetrieveAPIView.get_object(self)
        return userPrefsInstance.profile.user

    def get_permissions(self):
        if self.action == "list":
            return [IsAdmin()]

        return super().get_permissions()
