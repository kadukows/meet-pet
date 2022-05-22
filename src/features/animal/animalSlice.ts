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
    shelter: number | null;
}

export enum UserAnimalLikeRelationState {
    LIKED = 'LI',
    NOT_ACCEPTED = 'NO',
    ACCEPTED = 'AC',
}

export interface UserAnimalLikeRelation {
    id: number;
    user_prefs: number;
    animal: number;
    state: UserAnimalLikeRelationState;
}
