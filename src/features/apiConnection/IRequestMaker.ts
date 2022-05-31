import { AnimalKind } from '../animalKind/animaKindSlice';
import { ShelterPreferences, User, UserPreferences } from '../auth/userSlice';
import { Color } from '../colors/colorSlice';
import { SpecificAnimalKind } from '../specificAnimalKind/specificAnimalKindSlice';
import { Animal, UserAnimalLikeRelation } from '../animal/animalSlice';
import { Character } from '../characters/charcterSlice';
import { Size } from '../size/sizeSlice';

// TODO: maybe handle errors from server? (so returns will look something like "Promise<string | ErrorType>")
// It could also throw some error
// up to discussion
//
// Interface handling connection between backend and frontend.
// All requests should be routed through this, so we can simply exchange this object in factory
// when the actual backend comes.

export type WritableUserPreferences = Omit<UserPreferences, 'avatar'>;

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

    fetchShelter: (
        token: string,
        shelter_id: number
    ) => Promise<ShelterPreferences | null>;

    fetchAnimal: (token: string, shelter_id: number) => Promise<Animal | null>;

    likeAnimal: (token: string, animal_id: number) => Promise<true | null>;
    dislikeAnimal: (token: string, animal_id: number) => Promise<true | null>;

    likedAnimals: (token: string) => Promise<Animal[] | null>;

    // shelters things
    shelter: {
        getOwnAnimals: (token: string) => Promise<Animal[] | null>;
        createAnimal: (
            token: string,
            animal: AnimalCreate
        ) => Promise<Animal | null>;
        updateAnimal: (
            token: string,
            animal: AnimalUpdate
        ) => Promise<Animal | null>;
        deleteAnimal: (
            token: string,
            animal_id: number
        ) => Promise<true | null>;
        uploadPhoto: (
            token: string,
            formData: FormData
        ) => Promise<Photo | null>;
        deletePhoto: (token: string, photo_id: number) => Promise<true | null>;
        updateShelterPreferences: (
            token: string,
            update: ShelterPreferences
        ) => Promise<ShelterPreferences | null>;
        ////
        userAnimalRel: {
            accept: (
                token: string,
                user_animal_rel_id: number
            ) => Promise<true | null>;
            no_accept: (
                token: string,
                user_animal_rel_id: number
            ) => Promise<true | null>;
        };
        /////
        getUserByUserPrefsId: (
            token: string,
            user_prefs_id: number
        ) => Promise<User | null>;
    };
    setUserAnimalPreferences: (
        token: string,
        user_animal_prefs: WritableUserPreferences
    ) => Promise<UserPreferences | null>;
    getUserAnimalRelations: (
        token: string
    ) => Promise<UserAnimalLikeRelation[] | null>;
    uploadAvatar: (
        token: string,
        formData: FormData,
        onUploadProgress?: (a: ProgressEvent) => void
    ) => Promise<Avatar | null>;
    deleteAvatar: (token: string) => Promise<true | null>;

    updatePersonalInfo: (
        token: string,
        profile_info: PersonalInfo
    ) => Promise<PersonalInfo | null>;

    updateAccountInfo: (
        token: string,
        account_info: AccountInfo
    ) => Promise<AccountInfo | Errors<AccountInfo>>;

    registerAccount: (
        register_values: RegisterValues
    ) => Promise<true | Errors<RegisterValues>>;
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

export interface AnimalUpdate {
    id: number;
    name: string;
    specific_animal_kind: number;
    description: string;
    characters: number[];
    colors: number[];
    size: number;
    male: boolean;
    likes_child: boolean;
    likes_other_animals: boolean;
}

export type AnimalCreate = Omit<AnimalUpdate, 'id'>;

export interface Photo {
    id: number;
    animal: number;
    url: string;
}

export interface Avatar {
    url: string;
}

export interface PersonalInfo {
    first_name: string;
    last_name: string;
    description: string;
    has_garden: boolean;
}

export interface AccountInfo {
    email: string | null;
    password: string | null;
}

export type Errors<T> = {
    [Property in keyof T]?: string;
} & {
    is_error: true;
};

export const isRequestMakerErrors = (err: Errors<unknown> | any) => {
    return typeof err === 'object' && err !== null && err.is_error === true;
};

export type RegisterValues = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};
