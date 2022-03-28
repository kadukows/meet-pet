from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import Group, Permission
from api.models import Color


class Command(BaseCommand):
    help = "Populates inital database with basic values"

    def handle(self, *args, **options):
        normal_group, _ = Group.objects.get_or_create(name="Normal")
        shelter_group, _ = Group.objects.get_or_create(name="Shelter")
        admin_group, _ = Group.objects.get_or_create(name="Admin")

        # normal_group.permissions.add('api.')
        normal_permissions = ["view_color"]
        shelter_permissions = ["view_color"]
        admin_permissions = [
            "add_color",
            "change_color",
            "delete_color",
            "view_color",
        ]

        normal_group.permissions.set(
            [Permission.objects.get(codename=p) for p in normal_permissions]
        )
        shelter_group.permissions.set(
            [Permission.objects.get(codename=p) for p in shelter_permissions]
        )
        admin_group.permissions.set(
            [Permission.objects.get(codename=p) for p in admin_permissions]
        )
