import { AnimalKind } from '../animalKind/animaKindSlice';
import { User } from '../auth/userSlice';
import { Color } from '../colors/colorSlice';
import { SpecificAnimalKind } from '../specificAnimalKind/specificAnimalKindSlice';
import { Animal } from '../animal/animalSlice';
import { Character } from '../characters/charcterSlice';
import { Size } from '../size/sizeSlice';

// TODO: maybe handle errors from server? (so returns will look something like "Promise<string | ErrorType>")
// It could also throw some error
// up to discussion
//
// Interface handling connection between backend and frontend.
// All requests should be routed through this, so we can simply exchange this object in factory
// when the actual backend comes.
interface IRequestMaker {
    getToken: (username: string, password: string) => Promise<string | null>;
    getUser: (token: string) => Promise<User | null>;
    getColors: (token: string) => Promise<Color[] | null>;
    getAnimalKinds: (token: string) => Promise<AnimalKind[] | null>;
    getSpecificAnimalKinds: (
        token: string
    ) => Promise<SpecificAnimalKind[] | null>;
    getCharacters: (token: string) => Promise<Character[] | null>;
    getSizes: (token: string) => Promise<Size[] | null>;
    //
    getNextAnimalForTinderLikeChoose: (token: string) => Promise<Animal | null>;
    getAnimalList: (
        token: string,
        animal_query_params: AnimalQueryParams
    ) => Promise<PaginatedResponse<Animal> | null>;
}

export type { IRequestMaker };

////////////////////////

export interface AnimalQueryParams {
    characters?: number[];
    colors?: number[];
    male?: boolean | null;
    likes_child?: boolean | null;
    likes_other_animals?: boolean | null;
    name_contains?: string | null;
    specific_animal_kind?: number[];
    size?: number[];
    animal_kind?: number[];
    ////
    limit?: number | null;
    offset?: number | null;
}

interface PaginatedResponse<T> {
    count: number;
    results: T[];
}
