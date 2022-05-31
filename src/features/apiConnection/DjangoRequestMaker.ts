import axios, { AxiosError } from 'axios';
import {
    Animal,
    UserAnimalLikeRelation,
    UserAnimalLikeRelationState,
} from '../animal/animalSlice';
import { AnimalKind } from '../animalKind/animaKindSlice';
import { Character } from '../characters/charcterSlice';
import { Color } from '../colors/colorSlice';
import { Size } from '../size/sizeSlice';
import {
    AccountInfo,
    AnimalQueryParams,
    Errors,
    IRequestMaker,
    PersonalInfo,
} from './IRequestMaker';
import {
    ShelterPreferences,
    User,
    UserType,
    UserPreferences,
    Location,
} from '../auth/userSlice';
import { sleep } from '../../helpers';

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
        try {
            const res = await axios.get<UserResponse>(
                '/api/user/me/',
                makeAuthHeader(token)
            );

            return transformUser(res.data);
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
                results: res.data.results.map(transformAnimal),
            };
        } catch (e) {}

        return null;
    },

    fetchShelter: async (token, shelter_id) => {
        try {
            const res = await axios.get<ShelterPreferenceResponse>(
                `/api/shelter_preferences/${shelter_id}/`,
                makeAuthHeader(token)
            );

            return transformShelterPreferences(res.data);
        } catch (e) {
            console.error(e);
        }

        return null;
    },

    fetchAnimal: async (token, animal_id) => {
        try {
            const res = await axios.get<AnimalResponse>(
                `/api/animals/${animal_id}/`,
                makeAuthHeader(token)
            );

            return transformAnimal(res.data);
        } catch (e) {
            console.error(e);
        }

        return null;
    },

    likeAnimal: async (token, animal_id) => {
        try {
            const resPromise = axios.post(
                `/api/animals/${animal_id}/like/`,
                null,
                makeAuthHeader(token)
            );
            const sleepPromise = sleep(500);
            await Promise.all([resPromise, sleepPromise]);
            return true;
        } catch (e) {
            console.error(e);
        }

        return null;
    },

    dislikeAnimal: async (token: string, animal_id: number) => {
        try {
            await axios.post(
                `/api/animals/${animal_id}/dislike/`,
                null,
                makeAuthHeader(token)
            );

            return true;
        } catch (e) {
            console.error(e);
        }

        return null;
    },

    likedAnimals: async (token) => {
        try {
            const res = await axios.get<AnimalResponse[]>(
                '/api/animals/liked_animals/',
                makeAuthHeader(token)
            );

            return res.data.map(transformAnimal);
        } catch (e) {
            console.error(e);
        }

        return null;
    },

    shelter: {
        getOwnAnimals: async (token) => {
            try {
                const res = await axios.get<AnimalResponse[]>(
                    '/api/animals/shelters/',
                    makeAuthHeader(token)
                );

                return res.data.map(transformAnimal);
            } catch (e) {
                console.error('Siema', e);
            }

            return null;
        },

        createAnimal: async (token, animal) => {
            try {
                const res = await axios.post<{ id: number }>(
                    '/api/animals/',
                    animal,
                    makeAuthHeader(token)
                );

                const animalRes = await axios.get<AnimalResponse>(
                    `/api/animals/${res.data.id}/`,
                    makeAuthHeader(token)
                );

                return transformAnimal(animalRes.data);
            } catch (e) {
                console.error(e);
            }

            return null;
        },

        updateAnimal: async (token, animal) => {
            try {
                const animalRequest = { ...animal, id: undefined };

                console.log(animalRequest);

                const res = await axios.put<{ id: number }>(
                    `/api/animals/${animal.id}/`,
                    animal,
                    makeAuthHeader(token)
                );

                const animalRes = await axios.get<AnimalResponse>(
                    `/api/animals/${res.data.id}/`,
                    makeAuthHeader(token)
                );

                return transformAnimal(animalRes.data);
            } catch (e) {}

            return null;
        },

        deleteAnimal: async (token, animal_id) => {
            try {
                await axios.delete(
                    `/api/animals/${animal_id}/`,
                    makeAuthHeader(token)
                );

                return true;
            } catch (e) {
                console.error();
            }

            return null;
        },

        uploadPhoto: async (token: string, formData: FormData) => {
            try {
                interface PhotoResponse {
                    id: number;
                    animal: number;
                    image_url: string;
                }

                const res = await axios.post<PhotoResponse>(
                    '/api/my_photos/',
                    formData,
                    makeAuthHeader(token)
                );

                const { id, animal, image_url } = res.data;
                return { id, animal, url: image_url };
            } catch (e) {
                console.error(e);
            }

            return null;
        },

        deletePhoto: async (token, photo_id) => {
            try {
                await axios.delete(
                    `/api/my_photos/${photo_id}/`,
                    makeAuthHeader(token)
                );
                return true;
            } catch (e) {
                console.error(e);
            }

            return null;
        },

        updateShelterPreferences: async (
            token: string,
            update: ShelterPreferences
        ) => {
            try {
                const res = await axios.put<ShelterPreferenceResponse>(
                    `/api/shelter_preferences/${update.id}/`,
                    {
                        description: update.description,
                        location: update.location
                            ? formatLocation(
                                  update.location.latitude,
                                  update.location.longitude
                              )
                            : null,
                    },
                    makeAuthHeader(token)
                );

                return transformShelterPreferences(res.data);
            } catch (e) {
                console.error(e);
            }

            return null;
        },

        userAnimalRel: {
            accept: async (token, user_animal_rel_id) => {
                return await userAnimalRelCommon(
                    token,
                    user_animal_rel_id,
                    'accept'
                );
            },

            no_accept: async (token, user_animal_rel_id) => {
                return await userAnimalRelCommon(
                    token,
                    user_animal_rel_id,
                    'not_accept'
                );
            },
        },

        getUserByUserPrefsId: async (token, user_prefs_id) => {
            try {
                const res = await axios.get<UserResponse>(
                    `/api/user_detail_shelter/${user_prefs_id}/`,
                    makeAuthHeader(token)
                );

                return transformUser(res.data);
            } catch (e) {}

            return null;
        },
    },
    setUserAnimalPreferences: async (token, user_animal_prefs) => {
        const prefs: Partial<Omit<UserPreferencesResponse, 'id'>> = {
            // booleans
            has_garden: user_animal_prefs.has_garden,
            is_male: user_animal_prefs.male,
            likes_children: user_animal_prefs.likes_children,
            likes_other_animals: user_animal_prefs.likes_other_animals,
            // m2m rels
            liked_colors: user_animal_prefs.colors,
            liked_charactes: user_animal_prefs.characters,
            liked_kinds: user_animal_prefs.animal_kind,
            //
            location:
                formatObjectLocation(user_animal_prefs.location) ?? undefined,
            liked_animals: user_animal_prefs.liked_animals,
            // TODO
            //liked_specific_kinds: ,

            // TODO
            // liked_sizes: user_animal_prefs.size as number[],
        };

        try {
            const res = await axios.put<UserPreferencesResponse>(
                `/api/user_preferences/${user_animal_prefs.id}/`,
                prefs,
                makeAuthHeader(token)
            );

            return transformUserPreferences(res.data);
        } catch (e) {
            console.error(e);
        }

        return null;
    },

    getUserAnimalRelations: async (token: string) => {
        try {
            const res = await axios.get<UserAnimalLikeRelationResponse[]>(
                '/api/user_animal_like_rel/',
                makeAuthHeader(token)
            );

            return res.data.map(transformUserAnimalLikeRelation);
        } catch (e) {}

        return null;
    },

    uploadAvatar: async (token, formData, onUploadProgress) => {
        try {
            const resP = await axios.post<UserResponse>(
                '/api/user/upload_photo/',
                formData,
                {
                    onUploadProgress,
                    ...makeAuthHeader(token),
                }
            );
            const sP = sleep(500);

            const [res] = await Promise.all([resP, sP]);

            return res.data.profile.user_prefs?.avatar
                ? { url: res.data.profile.user_prefs?.avatar }
                : null;
        } catch (e) {}

        return null;
    },

    deleteAvatar: async (token) => {
        try {
            await axios.delete(
                '/api/user/delete_avatar/',
                makeAuthHeader(token)
            );

            return true;
        } catch (e) {}

        return null;
    },

    updatePersonalInfo: async (token: string, personal_info: PersonalInfo) => {
        try {
            const sP = sleep(500);
            const resP = await axios.post<PersonalInfo>(
                '/api/user/update_personal_info/',
                personal_info,
                makeAuthHeader(token)
            );

            const [res] = await Promise.all([resP, sP]);

            return res.data;
        } catch (e) {}

        return null;
    },

    updateAccountInfo: async (token, account_info) => {
        try {
            const resP = axios.post<AccountInfo>(
                '/api/user/update_account_info/',
                account_info,
                makeAuthHeader(token)
            );
            const sP = sleep(500);

            const [res] = await Promise.all([resP, sP]);

            return res.data;
        } catch (e: any) {
            if (axios.isAxiosError(e)) {
                type MyErrors = Omit<Errors<typeof account_info>, 'is_error'>;
                const err = e as AxiosError<MyErrors>;

                return {
                    is_error: true,
                    ...err.response?.data,
                };
            }

            throw e;
        }
    },

    registerAccount: async (register_values) => {
        try {
            await axios.post<UserResponse>('/api/user/', register_values);

            return true;
        } catch (e: any) {
            if (axios.isAxiosError(e)) {
                type MyErrors = Omit<
                    Errors<typeof register_values>,
                    'is_error'
                >;
                const err = e as AxiosError<MyErrors>;

                return {
                    is_error: true,
                    ...err.response?.data,
                };
            }

            throw e;
        }
    },
};

const makeAuthHeader = (token: string) => ({
    headers: {
        Authorization: `Bearer ${token}`,
    },
});

export { DjangoRequestMaker };

interface AnimalResponse {
    id: number;
    name: string;
    specific_animal_kind: {
        id: number;
        value: string;
        animal_kind: {
            id: number;
            value: string;
        };
    };
    description: string;
    characters: Array<{ id: number; value: string }>;
    colors: Array<{ id: number; value: string }>;
    size: { id: number; value: string };
    male: boolean;
    likes_child: boolean;
    likes_other_animals: boolean;
    photos: Array<{ id: number; image_url: string }>;
    shelter: number | null;
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
        shelter,
    } = res;

    return {
        id,
        name,
        description,
        specific_animal_kind: specific_animal_kind,
        characters,
        colors,
        size,
        is_male: male,
        likes_child,
        likes_other_animals,
        photos: photos.map((p) => ({
            id: p.id,
            url: p.image_url,
        })),
        shelter,
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

interface LocationResponse {
    longitude: string;
    latitude: string;
}

interface ShelterPreferenceResponse {
    id: number;
    description: string;
    location: LocationResponse | null;
}

interface UserPreferencesResponse {
    id: number;
    // boolean preferences
    is_male: boolean | null;
    likes_children: boolean | null;
    likes_other_animals: boolean | null;
    // m2m relations
    liked_colors: number[];
    liked_charactes: number[];
    liked_kinds: number[];
    // additional stuff
    description: string;
    has_garden: boolean;
    avatar: string | null;
    location: LocationResponse | null;
    liked_animals: number[];
}

interface UserResponse {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    ///////
    profile: {
        shelter_prefs: null | ShelterPreferenceResponse;
        user_prefs: null | UserPreferencesResponse;
    };
}

const transformUser = (user_response: UserResponse): User => {
    let shelter_prefs: ShelterPreferences | null = null;
    let user_prefs: UserPreferences | null = null;
    let user_type = UserType.Normal;

    if (user_response.profile.shelter_prefs !== null) {
        user_type = UserType.Shelter;
        shelter_prefs = transformShelterPreferences(
            user_response.profile.shelter_prefs
        );
    } else if (user_response.profile.user_prefs !== null) {
        user_prefs = transformUserPreferences(user_response.profile.user_prefs);
    }

    return {
        username: user_response.username,
        email: user_response.email,
        first_name: user_response.first_name,
        last_name: user_response.last_name,
        user_type,
        shelter_prefs,
        user_prefs,
    };
};

const transformShelterPreferences = (
    response: ShelterPreferenceResponse
): ShelterPreferences => {
    return {
        id: response.id,
        description: response.description,
        location: response.location ? parseLocation(response.location) : null,
    };
};

const transformUserPreferences = ({
    id,
    has_garden,
    is_male,
    avatar,
    likes_children,
    likes_other_animals,
    liked_colors,
    liked_charactes,
    liked_kinds,
    location,
    liked_animals,
    description,
}: UserPreferencesResponse): UserPreferences => {
    return {
        id,
        animal_kind: liked_kinds,
        specific_animal_kind: [], // TODO
        colors: liked_colors,
        characters: liked_charactes,
        size: [], // TODO
        //
        male: is_male,
        likes_children,
        likes_other_animals,
        //
        has_garden,
        avatar,
        location: location ? parseLocation(location) : null,
        liked_animals,
        description,
    };
};

function numWholeDigits(x: number) {
    return (Math.log10((x ^ (x >> 31)) - (x >> 31)) | 0) + 1;
}

const formatNumber = (
    x: number,
    max_digits: number,
    decimal_places: number
) => {
    const wholeDigitNo = numWholeDigits(x);
    const decimalPlaces = Math.min(max_digits - wholeDigitNo, decimal_places);

    return x.toFixed(decimalPlaces);
};

const formatLocation = (lat: number, lng: number) => ({
    latitude: formatNumber(lat, 8, 6),
    longitude: formatNumber(lng, 9, 6),
});

const formatObjectLocation = (loc: Location | null): LocationResponse | null =>
    loc ? formatLocation(loc.latitude, loc.longitude) : null;

const parseLocation = (loc: LocationResponse) => ({
    longitude: parseFloat(loc.longitude),
    latitude: parseFloat(loc.latitude),
});

interface UserAnimalLikeRelationResponse {
    id: number;
    user: number;
    animal: number;
    state: 'LI' | 'NO' | 'AC';
    name: string;
}

const transformUserAnimalLikeRelation = ({
    id,
    user,
    animal,
    state,
    name,
}: UserAnimalLikeRelationResponse): UserAnimalLikeRelation => ({
    id,
    user_prefs: user,
    animal,
    state: state as UserAnimalLikeRelationState,
    name,
    is_updating: false,
});

const userAnimalRelCommon = async (
    token: string,
    user_animal_rel_id: number,
    postfix: string
) => {
    await sleep(500);

    try {
        await axios.post(
            `/api/user_animal_like_rel/${user_animal_rel_id}/${postfix}/`,
            {},
            makeAuthHeader(token)
        );

        return true;
    } catch (e) {}

    return null;
};
