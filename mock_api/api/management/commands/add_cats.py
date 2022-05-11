import json, os, catnames
from random import randint, shuffle, choice as random_choice
from urllib import request
from itertools import cycle
from django.core.management.base import BaseCommand, CommandError, CommandParser
from django.core.files import File

from api.models import (
    Animal,
    AnimalKind,
    Character,
    Color,
    Photo,
    Size,
    SpecificAnimalKind,
)
from .utils.lorem_ipsum import get_lorem
from .utils.proxy_image import ProxyImage


class Command(BaseCommand):
    help = "Adds cats from The Cats API into db"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument("api_key", nargs="?", type=str)
        parser.add_argument("breeds_no", nargs="?", default=10, type=int)

    def handle(self, *args, **options):
        apikey = options["api_key"]
        if apikey is None:
            apikey = os.environ["CAT_API_KEY"]

        if not apikey:
            raise CommandError("api key for The Cats Api not found")

        headers = {"x-api-key": apikey}
        breeds_request = request.Request(
            "https://api.thecatapi.com/v1/breeds", headers=headers
        )
        cat = AnimalKind.objects.get(value="cat")
        sizes = Size.objects.all()
        colors = Color.objects.all()
        characters = Character.objects.all()

        with request.urlopen(breeds_request) as res:
            if res is None:
                raise CommandError("Problem with connecting to Cat API")

            breeds = json.loads(res.read())

        shuffle(breeds)

        for breed in breeds[: options["breeds_no"]]:
            images_request = request.Request(
                f"https://api.thecatapi.com/v1/images/search?breed_id={breed['id']}&limit=30&order=RANDOM",
                headers=headers,
            )
            with request.urlopen(images_request) as res:
                images = (ProxyImage(img, apikey) for img in json.loads(res.read()))
                images = [img for img in images if img.is_valid()]

                if len(images) == 0:
                    self.stderr.write(
                        f"Skipping breed: {breed['name']}, id: {breed['id']}, as there is no viable image for it"
                    )
                    continue

                images = cycle(images)

            sak = self.get_specific_animal_kind(breed["name"], cat)

            for _ in range(10):
                animal = Animal.objects.create(
                    name=catnames.gen(),
                    specific_animal_kind=sak,
                    size=random_choice(sizes),
                    male=randint(0, 1),
                    likes_child=randint(0, 1),
                    likes_other_animals=randint(0, 1),
                    description=get_lorem(),
                    randomly_generated=True,
                )

                self.stdout.write(f"Adding {animal.name}")

                chars = set(random_choice(characters) for _ in range(randint(1, 2)))
                clrs = set(random_choice(colors) for _ in range(randint(1, 2)))

                animal.characters.set(chars)
                animal.colors.set(clrs)

                animal.save()

                for i, img in zip(range(3), images):
                    img_file = File(open(img.get_path(), "rb"))
                    photo = Photo(animal=animal)
                    photo.file.save(f"{animal.name}-{i}", img_file)
                    animal.photos.add(photo)

                animal.save()

    def get_specific_animal_kind(
        self, name: str, ak: AnimalKind, randomly_generated=True
    ) -> SpecificAnimalKind:
        sak = SpecificAnimalKind.objects.filter(value=name).first()

        if sak is None:
            sak = SpecificAnimalKind(
                value=name, animal_kind=ak, randomly_generated=randomly_generated
            )
            sak.save()

        return sak
