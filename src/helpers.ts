import React from 'react';
import {
    ActionReducerMapBuilder,
    AsyncThunk,
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    EntityAdapter,
    EntityId,
    EntityState,
    PayloadAction,
    Update,
} from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import { observer } from 'redux-observers';
import { addAlert } from './features/alerts/alertsSlice';

export const makeObserverOnAuthed = (loginAction: any, logoutAction: any) => {
    return observer(
        (state: any) => state.authReducer.authorized,
        (dispatch, current, previous) => {
            if (previous === false && current === true) {
                dispatch(loginAction);
            } else if (previous === true && current === false) {
                dispatch(logoutAction);
            }
        }
    );
};

interface WithLoadProperties {
    loading: boolean;
    loaded: boolean;
}

export function addCommonBuilderCasesForAsyncThunk<
    T,
    S extends WithLoadProperties & EntityState<T>
>(
    thunk: AsyncThunk<T[], any, {}>,
    adapter: EntityAdapter<T>,
    builder: ActionReducerMapBuilder<S>
) {
    builder.addCase(thunk.pending, (state) => {
        state.loading = true;
        state.loaded = false;
    });

    builder.addCase(thunk.fulfilled, (state, action) => {
        adapter.setAll(state as any, action);

        state.loaded = true;
        state.loading = false;
    });

    builder.addCase(thunk.rejected, (state) => {
        state.loaded = true;
        state.loading = false;
    });
}

interface WithId {
    id: number;
}

export function createCommonObjectReducerAndStuff<T extends WithId>(
    asyncGet: (token: string) => Promise<T[] | null>,
    name: string
) {
    const adapter = createEntityAdapter<T>();
    const initialState = {
        loaded: false,
        loading: false,
        ...adapter.getInitialState(),
    };

    const fetch = createAsyncThunk(`${name}/fetch`, async (arg, thunkApi) => {
        const res = await asyncGet(
            (thunkApi.getState() as any).authReducer.token
        );

        if (res === null) {
            thunkApi.dispatch(
                addAlert({
                    type: 'error',
                    message: 'Problem occured when fetching some data',
                })
            );

            console.error(
                'Problem occured when fetching some data from reducer: ' + name
            );

            return thunkApi.rejectWithValue(null);
        }

        return res;
    });

    const slice = createSlice({
        name,
        initialState,
        reducers: {
            setAll: adapter.setAll as (
                d: WritableDraft<typeof initialState>,
                a: PayloadAction<T[]>
            ) => void,
            removeAll: adapter.removeAll as (
                d: WritableDraft<typeof initialState>
            ) => void,
            updateOne: adapter.updateOne as (
                d: WritableDraft<typeof initialState>,
                a: PayloadAction<Update<T>>
            ) => void,
            addOne: adapter.addOne as (
                d: WritableDraft<typeof initialState>,
                a: PayloadAction<T>
            ) => void,
            removeOne: adapter.removeOne as (
                d: WritableDraft<typeof initialState>,
                a: PayloadAction<EntityId>
            ) => void,
        },
        extraReducers: (builder) => {
            addCommonBuilderCasesForAsyncThunk(fetch, adapter, builder);
        },
    });

    const selectors = adapter.getSelectors(
        (state: any) => state[`${name}Reducer`]
    );

    return {
        selectors,
        reducer: slice.reducer,
        actions: slice.actions,
        observer: makeObserverOnAuthed(fetch(), slice.actions.removeAll()),
        fetchAction: fetch,
    };
}

export const sleep = (ms: number) => {
    return new Promise<null>((accept, reject) =>
        setTimeout(() => accept(null), ms)
    );
};

export const useIntersectionWasInViewportOnce = (
    ref: React.RefObject<Element | null>
) => {
    const [seen, setSeen] = React.useState(false);

    React.useEffect(() => {
        if (ref.current === null) {
            throw new Error(
                'useIntersectionWasInViewportOnce(): ref.current is null'
            );
        }

        const element = ref.current;

        const iObserver = new IntersectionObserver((entries) => {
            const [e] = entries;
            if (e.isIntersecting) {
                setSeen(true);
                iObserver.unobserve(element);
            }
        });

        iObserver.observe(element);
        return () => {
            iObserver.unobserve(element);
        };
    }, [setSeen, ref]);

    return seen;
};

export const safeShallowUpdate = <T extends object>(
    root: T,
    update: Partial<T>
) => {
    const updateKeys = Object.keys(update);
    const rootKeys = Object.keys(root);

    const mixedSet = new Set<string>([...updateKeys, ...rootKeys]);
    const isUpdateSubsetOfRoot = mixedSet.size === rootKeys.length;

    if (!isUpdateSubsetOfRoot) {
        throw new Error('Updating with new keys');
    }

    for (const key of updateKeys as Array<keyof T>) {
        root[key] = update[key] as T[keyof T];
    }
};
