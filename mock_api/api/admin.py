from django.contrib import admin
from django.contrib.auth.models import Permission
from api.models import (
    Animal,
    AnimalKind,
    Character,
    Color,
    Location,
    Photo,
    Profile,
    Size,
    SpecificAnimalKind,
    UserPrefs,
    ShelterPrefs,
)


admin.site.register(Profile)
admin.site.register(Location)
admin.site.register(UserPrefs)
admin.site.register(ShelterPrefs)
admin.site.register(Color)
admin.site.register(Size)
admin.site.register(Character)
admin.site.register(SpecificAnimalKind)
admin.site.register(AnimalKind)
admin.site.register(Animal)
admin.site.register(Photo)
