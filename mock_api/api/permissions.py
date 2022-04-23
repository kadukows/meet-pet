from rest_framework.permissions import BasePermission
from rest_framework.request import Request


class ShelterPermission(BasePermission):
    def has_permission(self, request: Request, view):
        if request.user.is_anonymous:
            return False

        user = request.user.profile
        return user.is_shelter() or user.is_admin()
