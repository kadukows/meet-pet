from rest_framework.permissions import BasePermission
from rest_framework.request import Request

from api.models import Profile


class IsNormalUser(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_anonymous:
            return False

        user: Profile = request.user.profile
        return user.is_normal_user()


class IsShelter(BasePermission):
    def has_permission(self, request: Request, view):
        if request.user.is_anonymous:
            return False

        user = request.user.profile
        return user.is_shelter()


class IsAdmin(BasePermission):
    def has_permission(self, request: Request, view):
        if request.user.is_anonymous:
            return False

        return request.user.profile.is_admin()


class OrPermission(BasePermission):
    def __init__(self, *args):
        self.perms = args

    def has_permission(self, request, view):
        return any(p.has_permission(request, view) for p in self.perms)
