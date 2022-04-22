import axios from 'axios';
import { Animal } from '../animal/animalSlice';
import { AnimalKind } from '../animalKind/animaKindSlice';
import { UserPreferences } from '../auth/userSlice';
import { Character } from '../characters/charcterSlice';
import { Color } from '../colors/colorSlice';
import { Size } from '../size/sizeSlice';
import {
    AnimalQueryParams,
    IRequestMaker,
    UserPreferencesResponse,
} from './IRequestMaker';

function transformUserPrefs(res: UserPreferencesResponse): UserPreferences {
    return {
        has_garden: res.has_garden,
        animal_kind: res.liked_kinds,
        specific_animal_kind: res.liked_specific_kinds,
        colors: res.liked_colors,
        characters: res.liked_charactes,
        size: res.liked_sizes,
        male: res.is_male,
        likes_children: res.likes_children,
        likes_other_animals: res.likes_other_animals,
    };
}

const DjangoRequestMaker: IRequestMaker = {
    getToken: async (username, password) => {
        interface TokenResponse {
            token: string;
        }

        try {
            const res = await axios.post<TokenResponse>('/api/get_token/', {
                username,
                password,
            });

            return res.data.token;
        } catch (e: any) {}

        return null;
    },

    getUser: async (token) => {
        interface UserResponse {
            username: string;
            first_name: string;
            last_name: string;
            email: string;
            profile: {
                user_prefs: UserPreferencesResponse;

                shelter_prefs: null | {
                    location: string;
                };
            };
        }

        try {
            const res = await axios.get<UserResponse>(
                '/api/user/me/',
                makeAuthHeader(token)
            );
            return {
                username: res.data.username,
                email: res.data.email,
                full_name: res.data.first_name.concat(' ', res.data.last_name),
                preferences: transformUserPrefs(res.data.profile.user_prefs),
            };
        } catch (e: any) {}

        return null;
    },

    getColors: async (token) => {
        try {
            const res = await axios.get<Color[]>(
                '/api/colors/',
                makeAuthHeader(token)
            );

            return res.data;
        } catch (e) {}

        return null;
    },

    getAnimalKinds: async (token) => {
        try {
            const res = await axios.get<AnimalKind[]>(
                '/api/animal_kinds/',
                makeAuthHeader(token)
            );
            return res.data;
        } catch (e) {}

        return null;
    },

    getSpecificAnimalKinds: async (token) => {
        try {
            interface ApiObject {
                id: number;
                value: string;
                animal_kind: {
                    id: number;
                };
            }

            const res = await axios.get<ApiObject[]>(
                '/api/specific_animal_kinds/',
                makeAuthHeader(token)
            );

            return res.data.map((apiObj) => ({
                id: apiObj.id,
                value: apiObj.value,
                animal_kind_id: apiObj.animal_kind.id,
            }));
        } catch (e) {}

        return null;
    },

    getCharacters: async (token) => {
        try {
            const res = await axios.get<Character[]>(
                '/api/characters/',
                makeAuthHeader(token)
            );
            return res.data;
        } catch (e) {}

        return null;
    },

    getSizes: async (token: string) => {
        try {
            const res = await axios.get<Size[]>(
                '/api/sizes/',
                makeAuthHeader(token)
            );
            return res.data;
        } catch (e) {}

        return null;
    },

    getNextAnimalForTinderLikeChoose: async (token) => {
        try {
            const resPromise = axios.post<AnimalResponse>(
                '/api/animals/next/',
                null,
                makeAuthHeader(token)
            );

            // to showcase animation
            const sleepPromise = sleep(2000);

            const [res] = await Promise.all([resPromise, sleepPromise]);

            return transformAnimal(res.data);
        } catch (e) {}

        return null;
    },

    getAnimalList: async (token, queryParams) => {
        const urlSearchParams = parseAnimalQueryParams(queryParams);

        try {
            const res = await axios.get<PaginatedResponse<AnimalResponse>>(
                '/api/animals/?' + urlSearchParams.toString(),
                makeAuthHeader(token)
            );

            return {
                count: res.data.count,
                results: res.data.results.map((ar) => transformAnimal(ar)),
            };
        } catch (e) {}

        return null;
    },

    setUserAnimalPreferences: (
        token: string,
        user_animal_prefs: UserPreferences
    ) => {
        const prefs: UserPreferencesResponse = {
            has_garden: user_animal_prefs.has_garden as boolean,
            location: '',
            liked_kinds: user_animal_prefs.colors as number[],
            liked_specific_kinds:
                user_animal_prefs.specific_animal_kind as number[],
            liked_colors: user_animal_prefs.colors as number[],
            liked_charactes: user_animal_prefs.characters as number[],
            liked_sizes: user_animal_prefs.size as number[],
            is_male: user_animal_prefs.male as boolean,
            likes_children: user_animal_prefs.likes_children as boolean,
            likes_other_animals:
                user_animal_prefs.likes_other_animals as boolean,
        };

        try {
            axios.post(
                '/api/preferences/',
                JSON.stringify(prefs),
                makeAuthHeader(token)
            );
        } catch (e) {}

        return null;
    },
};

const makeAuthHeader = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

const sleep = (ms: number) => {
    return new Promise<null>((accept, reject) =>
        setTimeout(() => accept(null), ms)
    );
};

export { DjangoRequestMaker };

interface AnimalResponse {
    id: number;
    name: string;
    specific_animal_kind: {
        id: number;
        value: string;
    };
    description: string;
    characters: Array<{ value: string }>;
    colors: Array<{ value: string }>;
    size: { value: string };
    male: boolean;
    likes_child: boolean;
    likes_other_animals: boolean;
    photos: Array<{ image_url: string }>;
}

interface PaginatedResponse<T> {
    count: number;
    next: null;
    previous: null;
    results: T[];
}

function transformAnimal(res: AnimalResponse): Animal {
    const {
        id,
        name,
        specific_animal_kind,
        description,
        characters,
        colors,
        size,
        male,
        likes_child,
        likes_other_animals,
        photos,
    } = res;

    return {
        id,
        name,
        description,
        specific_animal_kind: specific_animal_kind.value,
        characters: characters.map((el) => el.value),
        colors: colors.map((el) => el.value),
        size: size.value,
        is_male: male,
        likes_child,
        likes_other_animals,
        photo_urls: photos.map((el) => el.image_url),
    };
}

const parseAnimalQueryParams = (q: AnimalQueryParams) => {
    const result = new URLSearchParams();

    if (q.characters !== undefined) {
        for (const character of q.characters) {
            result.append('characters', character.toString());
        }
    }

    if (q.colors !== undefined) {
        for (const color of q.colors) {
            result.append('colors', color.toString());
        }
    }

    if (q.male !== undefined && q.male !== null) {
        result.append('male', q.male.toString());
    }

    if (q.likes_child !== undefined && q.likes_child !== null) {
        result.append('likes_child', q.likes_child.toString());
    }

    if (q.likes_other_animals !== undefined && q.likes_other_animals !== null) {
        result.append('likes_other_animals', q.likes_other_animals.toString());
    }

    if (q.name_contains !== undefined && q.name_contains !== null) {
        result.append('name', q.name_contains);
    }

    if (q.specific_animal_kind !== undefined) {
        for (const sak of q.specific_animal_kind) {
            result.append('specific_animal_kind', sak.toString());
        }
    }

    if (q.size !== undefined) {
        for (const siz of q.size) {
            result.append('size', siz.toString());
        }
    }

    if (q.animal_kind !== undefined) {
        for (const ak of q.animal_kind) {
            result.append('specific_animal_kind__animal_kind', ak.toString());
        }
    }

    if (q.limit !== undefined && q.limit !== null) {
        result.append('limit', q.limit.toString());
    }

    if (q.offset !== undefined && q.offset !== null) {
        result.append('offset', q.offset.toString());
    }

    return result;
};
