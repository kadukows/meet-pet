import os
from urllib import request
from django.core.management.base import BaseCommand, CommandError
from django.core.files import File
from django.contrib.auth.models import Group, Permission, User
from PIL import Image
from api.models import (
    Animal,
    AnimalKind,
    Color,
    Photo,
    Size,
    Character,
    SpecificAnimalKind,
    ShelterPrefs,
    Profile,
)


COLORS = ["Brown", "Gold", "White", "Ginger"]
SIZES = ["Small", "Medium", "Big"]
CHARACTERS = ["Easygoing", "Energetic", "Calm", "Attentive", "Inquisitive"]
KINDS = {
    "dog": ["retriever", "bulldog", "german shepherd"],
    "cat": ["british", "sphynx", "shorthair", "outdoor"],
}


class AnimalDef:
    def __init__(
        self,
        name,
        specific_animal_kind,
        colors,
        characters,
        size,
        male,
        likes_child,
        likes_other_animals,
    ):
        self.name = name
        self.specific_animal_kind = specific_animal_kind
        self.colors = colors
        self.characters = characters
        self.size = size
        self.male = male
        self.likes_child = likes_child
        self.likes_other_animals = likes_other_animals


ANIMALS = [
    AnimalDef(
        "Alex",
        KINDS["dog"][2],
        [COLORS[0]],
        [CHARACTERS[1], CHARACTERS[3]],
        SIZES[2],
        True,
        True,
        True,
    ),
    AnimalDef(
        "Sofi",
        KINDS["cat"][3],
        [COLORS[3]],
        [CHARACTERS[2], CHARACTERS[4]],
        SIZES[0],
        False,
        True,
        False,
    ),
]


class Command(BaseCommand):
    help = "Populates inital database with basic values"

    def handle(self, *args, **options):
        self.createUsers()
        self.createColors()
        self.createSizes()
        self.createCharacters()
        self.createKinds()
        self.createAnimals()

    def createUsers(self):
        foo = User.objects.create(username="foo")
        foo.set_password("foo")
        foo.save()

        shelter = User.objects.create(username="shelter")
        shelter.set_password("shelter")

        shelter_prefs = ShelterPrefs.objects.create(description="Basic description")
        profile: Profile = shelter.profile
        profile.shelter_prefs = shelter_prefs
        profile.user_prefs = None

        profile.save()
        shelter.save()

        self.shelter_user = shelter

    def createColors(self):
        self.createObjects(Color, COLORS)

    def createSizes(self):
        self.createObjects(Size, SIZES)

    def createCharacters(self):
        self.createObjects(Character, CHARACTERS)

    def createObjects(self, Class, names):
        for name in names:
            self.createObject(Class, name)

    def createObject(self, Class, name):
        obj = Class.objects.filter(value=name).first()
        if obj is None:
            self.stdout.write(f"Creating {Class.__name__}: {name}")
            obj = Class.objects.create(value=name)
            obj.save()

    def createKinds(self):
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

    def createAnimals(self):
        for animalDef in ANIMALS:
            self.createAnimal(animalDef)

    def createAnimal(self, aDef: AnimalDef):
        animal: Animal = Animal.objects.filter(name=aDef.name).first()

        if animal is None:
            self.stdout.write(f"Creating animal: {aDef.name} :)")
            animal = Animal.objects.create(
                name=aDef.name,
                specific_animal_kind=SpecificAnimalKind.objects.get(
                    value=aDef.specific_animal_kind
                ),
                size=Size.objects.get(value=aDef.size),
                male=aDef.male,
                likes_child=aDef.likes_child,
                likes_other_animals=aDef.likes_other_animals,
                shelter=self.shelter_user.profile.shelter_prefs,
            )
            animal.characters.set(
                [
                    Character.objects.get(value=character)
                    for character in aDef.characters
                ]
            )
            animal.colors.set([Color.objects.get(value=color) for color in aDef.colors])

            with request.urlopen("http://loripsum.net/api/3/medium/plaintext") as res:
                animal.description = res.read().decode("UTF-8")

            photo_folder = f"api/management/commands/resources/{aDef.name}"
            photo_names = os.listdir(photo_folder)
            for photo_name in photo_names:
                img = File(open(f"{photo_folder}/{photo_name}", "rb"))
                photo = Photo(animal=animal)
                photo.file.save(photo_name, img)
                animal.photos.add(photo)

            animal.save()
