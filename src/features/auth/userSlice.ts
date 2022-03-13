import {
    createSlice,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../store';

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

/*
function canAuthProcessBeInstantiated(state: AuthState): boolean {
    return !state.authenticated && state.token !== null && !state.loading;
}

export const tryAuthWithCurrentToken =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        if (!canAuthProcessBeInstantiated(getState().authReducer)) {
            return;
        }

        dispatch(setLoading(true));

        try {
            const token = getState().authReducer.token;

            const res = await axios.get<User>(
                GENERAL_API_ROUTES.user,
                getTokenRequestConfig(token)
            );

            const { username } = res.data;
            dispatch(setUserTokenAuth({ user: { username }, token }));
        } catch (err) {
            dispatch(resetAuth());
        } finally {
            dispatch(setLoading(false));
        }
    };

export const tryAuthWithToken =
    (token: string): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        if (getState().authReducer.loading) {
            return;
        }

        dispatch(setLoading(true));

        try {
            const res = await axios.get(
                GENERAL_API_ROUTES.user,
                getTokenRequestConfig(token)
            );

            const { username } = res.data;
            dispatch(setUserTokenAuth({ user: { username }, token }));
        } catch (err) {
            dispatch(resetAuth());
        } finally {
            dispatch(setLoading(false));
        }
    };

*/
