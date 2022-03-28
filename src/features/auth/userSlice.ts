import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    username: string;
    email: string;
    full_name: string;
}

interface AuthState {
    loading: boolean;
    token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    loading: localStorage.getItem('token') ? true : false,
    token: localStorage.getItem('token'),
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setUserTokenAuth(state, action: PayloadAction<UserTokenAuthPayload>) {
            state.token = action.payload.token;
            state.user = action.payload.user;

            localStorage.setItem('token', action.payload.token);

            state.loading = false;
        },
        resetAuth(state) {
            state.loading = false;
            localStorage.removeItem('token');
            state.token = null;
            state.user = null;

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
