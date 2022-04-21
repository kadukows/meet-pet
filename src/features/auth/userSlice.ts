import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum UserType {
    Normal = 'Normal',
    Shelter = 'Shelter',
    Admin = 'Admin',
}

export interface User {
    username: string;
    email: string;
    full_name: string;
    user_type: UserType;
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
    },
});

interface UserTokenAuthPayload {
    token: string;
    user: User;
}

export const { setUserTokenAuth, resetAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
