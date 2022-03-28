from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, authentication, generics, response
from api.serializers import UserSerializer
from api.authentication import TokenBearerAuth


class UserViewSet(viewsets.GenericViewSet, generics.ListCreateAPIView):
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

    def list(self, request, *args, **kwargs):
        # this is hacky way to only return current user
        serializer = UserSerializer(request.user)
        return response.Response(serializer.data)
