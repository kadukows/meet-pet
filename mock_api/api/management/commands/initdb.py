from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import Group, Permission
from api.models import Animal, AnimalKind, Color, Size, Character, SpecificAnimalKind


COLORS = ["Brown", "Gold", "White"]
SIZES = ["Small", "Medium", "Big"]
CHARACTERS = ["Easygoing", "Energetic", "Calm", "Attentive"]
KINDS = {
    "dog": ["retriever", "bulldog", "german shepherd"],
    "cats": ["british", "sphynx", "shorthair", "outdoor"],
}


class Command(BaseCommand):
    help = "Populates inital database with basic values"

    def handle(self, *args, **options):
        for color in COLORS:
            obj = Color.objects.filter(value=color).first()
            if obj is None:
                self.stdout.write(f"Creating color: {color}")
                obj = Color.objects.create(value=color)
                obj.save()

        for size in SIZES:
            obj = Size.objects.filter(value=size).first()
            if obj is None:
                self.stdout.write(f"Creating size: {size}")
                obj = Size.objects.create(value=size)
                obj.save()

        for char in CHARACTERS:
            obj = Character.objects.filter(value=char).first()
            if obj is None:
                self.stdout.write(f"Creating character: {char}")
                obj = Character.objects.create(value=char)
                obj.save()

        for kind, specifics in KINDS.items():
            kind_obj = AnimalKind.objects.filter(value=kind).first()
            if kind_obj is None:
                self.stdout.write(f"Creating kind: {kind}")
                kind_obj = AnimalKind.objects.create(value=kind)
                kind_obj.save()

            for s in specifics:
                s_obj = SpecificAnimalKind.objects.filter(value=s).first()
                if s_obj is None:
                    self.stdout.write(f"Creating specific kind: {s}")
                    s_obj = SpecificAnimalKind.objects.create(
                        value=s, animal_kind=kind_obj
                    )
                    s_obj.save()

        shepherd1 = Animal.objects.filter(
            name="Alex",
            specific_animal_kind=SpecificAnimalKind.objects.get(
                value="german shepherd"
            ),
            size=Size.objects.get(value="Big"),
            male=True,
            likes_child=True,
            likes_other_animals=False,
        ).first()

        if shepherd1 is None:
            self.stdout.write(f"Created animal: Alex :)")
            shepherd1 = Animal.objects.create(
                name="Alex",
                specific_animal_kind=SpecificAnimalKind.objects.get(
                    value="german shepherd"
                ),
                size=Size.objects.get(value="Big"),
                male=True,
                likes_child=True,
                likes_other_animals=True,
            )
            shepherd1.characters.set(
                [
                    Character.objects.get(value="Energetic"),
                    Character.objects.get(value="Attentive"),
                ]
            )
            shepherd1.colors.set([Color.objects.get(value="Brown")])
            shepherd1.save()
