import axios from 'axios';
import { Animal } from '../animal/animalSlice';
import { AnimalKind } from '../animalKind/animaKindSlice';
import { Character } from '../characters/charcterSlice';
import { Color } from '../colors/colorSlice';
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

            return {
                username: res.data.username,
                email: res.data.email,
                full_name: res.data.first_name.concat(' ', res.data.last_name),
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

    getNextAnimalForTinderLikeChoose: async (token) => {
        const animal: Animal = {
            id: 4,
            name: 'Dog the dog',
            description: 'Dog the dog is really really special',
            specific_animal_kind: 'Sheperd',
            characters: ['Energetic', 'Nice'],
            colors: ['brown'],
            is_male: true,
            likes_child: false,
            likes_other_animals: false,
            photo_urls: [
                '/api/animal_images/owczarek-niemiecki.jpg',
                '/api/animal_images/owczarek-niemiecki-768x511.jpg',
                '/api/animal_images/1608716445.jpg',
            ],
        };

        //return null;
        await sleep(2000);

        return animal;
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
