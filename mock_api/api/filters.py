import django_filters

from api.models import Animal, AnimalKind, Size, SpecificAnimalKind


class AnimalFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="icontains")
    specific_animal_kind = django_filters.ModelMultipleChoiceFilter(
        queryset=SpecificAnimalKind.objects.all()
    )
    size = django_filters.ModelMultipleChoiceFilter(queryset=Size.objects.all())
    specific_animal_kind__animal_kind = django_filters.ModelMultipleChoiceFilter(
        queryset=AnimalKind.objects.all()
    )

    class Meta:
        model = Animal
        fields = [
            "characters",
            "colors",
            # "size",
            "male",
            "likes_child",
            "likes_other_animals",
        ]
