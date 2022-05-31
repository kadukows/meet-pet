import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { userInfo } from 'os';
import { safeShallowUpdate } from '../../helpers';
//import { AccountInfo } from '../apiConnection/IRequestMaker';

export enum UserType {
    Normal = 'Normal',
    Shelter = 'Shelter',
    Admin = 'Admin',
}

export interface Location {
    longitude: number;
    latitude: number;
}

export interface ShelterPreferences {
    id: number;
    description: string;
    location: null | Location;
}

export interface UserPreferences {
    id: number;
    animal_kind: number[];
    specific_animal_kind: number[];
    colors: number[];
    characters: number[];
    size: number[];
    //// prefs
    male: boolean | null;
    likes_children: boolean | null;
    likes_other_animals: boolean | null;
    ///// data
    description: string;
    has_garden: boolean;
    avatar: string | null;
    location: null | Location;
    liked_animals: number[];
    max_range: number;
}

export interface User {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: UserType;
    shelter_prefs: ShelterPreferences | null;
    user_prefs: UserPreferences | null;
}

export interface UpdatedAccountInfo {
    email: string;
}

interface AuthState {
    loading: boolean;
    token: string | null;
    user: User | null;
    authorized: boolean;
}

const initialState: AuthState = {
    loading: localStorage.getItem('token') ? true : false,
    token: localStorage.getItem('token'),
    user: null,
    authorized: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserTokenAuth(state, action: PayloadAction<UserTokenAuthPayload>) {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.authorized = true;

            localStorage.setItem('token', action.payload.token);

            state.loading = false;
        },
        resetAuth(state) {
            state.loading = false;
            localStorage.removeItem('token');
            state.token = null;
            state.user = null;
            state.authorized = false;

            state.loading = false;
        },
        updateShelterPreferences(
            state,
            action: PayloadAction<ShelterPreferences>
        ) {
            if (state.user === null || state.user.shelter_prefs === null) {
                console.error('Not shelter preferences to update');
                return;
            }

            state.user.shelter_prefs = action.payload;
        },
        updateUserPreferences(
            state,
            action: PayloadAction<Partial<UserPreferences>>
        ) {
            if (state.user === null || state.user.user_prefs === null) {
                console.error('Not shelter preferences to update');
                return;
            }

            safeShallowUpdate(state.user.user_prefs, action.payload);
        },
        updateAccountInfo(state, action: PayloadAction<UpdatedAccountInfo>) {
            if (state.user === null) {
                console.error('No user to update');
                return;
            }

            if (action.payload.email !== null) {
                state.user.email = action.payload.email;
            }
        },
        updateUser(
            state,
            action: PayloadAction<
                Partial<Omit<User, 'user_prefs' | 'shelter_prefs'>>
            >
        ) {
            if (state.user === null) {
                console.error('Not user to update');
                return;
            }

            safeShallowUpdate(state.user, action.payload);
        },
        likeAnimal(state, action: PayloadAction<number>) {
            if (!(state.user && state.user?.user_prefs)) {
                throw new Error('Not user in state');
            }

            state.user.user_prefs.liked_animals.push(action.payload);
        },
        dislikeAnimal(state, action: PayloadAction<number>) {
            if (!(state.user && state.user?.user_prefs)) {
                throw new Error('Not user in state');
            }

            state.user.user_prefs.liked_animals =
                state.user.user_prefs.liked_animals.filter(
                    (el) => el !== action.payload
                );
        },
    },
});

interface UserTokenAuthPayload {
    token: string;
    user: User;
}

export const {
    setUserTokenAuth,
    resetAuth,
    updateShelterPreferences,
    updateUserPreferences,
    updateAccountInfo,
    updateUser,
    likeAnimal,
    dislikeAnimal,
} = authSlice.actions;
export const authReducer = authSlice.reducer;
