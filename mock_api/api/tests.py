from django.test import TestCase
from django.http.response import HttpResponse
from django.contrib.auth.models import User

from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework.response import Response

from api.models import ShelterPrefs
from api.views import ShelterPreferencesViewSet


class ShelterPrefsTestCase(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create(username="foo")
        self.shelter_prefs = ShelterPrefs.objects.create(description="Lorem ipsum")

        return super().setUp()

    def test_shelter_preferences_update(self):
        factory = APIRequestFactory()
        view = ShelterPreferencesViewSet.as_view({"put": "update"})

        request = factory.put(
            f"/{self.shelter_prefs.id}/",
            {
                # "location": None,
                "description": "Lorem"
            },
            format="json",
        )
        force_authenticate(request, user=self.user)
        response: Response = view(request, pk=self.shelter_prefs.id)
        response.render()

        print(response.content)
