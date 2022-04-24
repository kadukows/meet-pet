import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum UserType {
    Normal = 'Normal',
    Shelter = 'Shelter',
    Admin = 'Admin',
}

export interface ShelterPreferences {
    id: number;
    description: string;
    location: null | {
        longitude: number;
        latitude: number;
    };
}

export interface User {
    username: string;
    email: string;
    full_name: string;
    user_type: UserType;
    shelter_prefs?: ShelterPreferences | null;
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
    },
});

interface UserTokenAuthPayload {
    token: string;
    user: User;
}

export const { setUserTokenAuth, resetAuth, updateShelterPreferences } =
    authSlice.actions;
export const authReducer = authSlice.reducer;
