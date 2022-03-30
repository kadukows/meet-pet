import {
    createSlice,
    createEntityAdapter,
    ThunkAction,
    PayloadAction,
    AnyAction,
} from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { observer } from 'redux-observers';
import { getRequestMaker } from '../apiConnection';

export interface Color {
    id: number;
    value: string;
}

const colorAdapter = createEntityAdapter<Color>();

interface ColorState extends ReturnType<typeof colorAdapter.getInitialState> {
    loading: boolean;
    loaded: boolean;
}

const initialState: ColorState = {
    loading: false,
    loaded: false,
    ...colorAdapter.getInitialState(),
};

//const { setAll, removeAll } = colorAdapter;
//const reducers = { setAll, removeAll };

const colorSlice = createSlice({
    name: 'color',
    initialState,
    reducers: {
        setColors: colorAdapter.setAll,
        removeColors: colorAdapter.removeAll,
        setLoading: (state, action: PayloadAction<boolean>) => {
            if (state.loading === true && action.payload === false) {
                state.loaded = false;
            }

            state.loading = action.payload;
        },
    },
});

export const colorSelectors = colorAdapter.getSelectors(
    (state: RootState) => state.colorReducer
);

export const { setColors, removeColors, setLoading } = colorSlice.actions;

export const colorReducer = colorSlice.reducer;

export const colorObserver = observer(
    (state: RootState) => state.authReducer.authorized,
    (dispatch: any, current, previous) => {
        if (previous === false && current === true) {
            dispatch(async (dispatch: any, getState: any) => {
                dispatch(setLoading(true));

                const colors = await getRequestMaker().getColors(
                    getState().authReducer.token as string
                );

                if (colors !== null) {
                    dispatch(setColors(colors));
                } else {
                    // some notif
                }

                dispatch(setLoading(false));
            });
        } else if (previous === true && current === false) {
            dispatch(removeColors());
        }
    }
);
