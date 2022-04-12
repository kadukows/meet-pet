import axios from 'axios';
import { Animal } from '../animal/animalSlice';
import { AnimalKind } from '../animalKind/animaKindSlice';
import { Character } from '../characters/charcterSlice';
import { Color } from '../colors/colorSlice';
import { Size } from '../size/sizeSlice';
import { IRequestMaker } from './IRequestMaker';

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
                user_prefs: null | {
                    has_garden: boolean;
                    location: string;
                    liked_kinds: number[];
                    liked_specific_kinds: number[];
                    liked_colors: number[];
                    liked_characters: number[];
                    liked_sizes: number[];
                };

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
            //TODO: SOME HARDCODING HERE
            return {
                username: res.data.username,
                email: res.data.email,
                full_name: res.data.first_name.concat(' ', res.data.last_name),
                liked_kinds: res.data.profile.user_prefs?.liked_kinds ?? [1],
                liked_specific_kinds: res.data.profile.user_prefs
                    ?.liked_specific_kinds ?? [1],
                liked_colors: res.data.profile.user_prefs?.liked_colors ?? [1],
                liked_characters: res.data.profile.user_prefs
                    ?.liked_characters ?? [1],
                liked_sizes: res.data.profile.user_prefs?.liked_sizes ?? [1],
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

    getSizes: async (token) => {
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
