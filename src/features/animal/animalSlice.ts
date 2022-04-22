interface EnumValue {
    id: number;
    value: string;
}

export interface Animal {
    id: number;
    name: string;
    description: string;
    specific_animal_kind: {
        id: number;
        value: string;
        animal_kind: {
            id: number;
            value: string;
        };
    };
    characters: EnumValue[];
    colors: EnumValue[];
    size: EnumValue;
    is_male: boolean;
    likes_child: boolean;
    likes_other_animals: boolean;
    photos: Array<{
        id: number;
        url: string;
    }>;
}
