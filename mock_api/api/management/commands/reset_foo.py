from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    def handle(self, *args, **options):
        foo = User.objects.filter(username="foo").first()
        assert foo is not None
        foo.set_password("foo")
        foo.save()
