import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    AnyAction,
    createAsyncThunk,
} from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { getRequestMaker } from '../apiConnection';
import { addAlert } from '../alerts/alertsSlice';
import {
    addCommonBuilderCasesForAsyncThunk,
    makeObserverOnAuthed,
} from '../../helpers';

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
    extraReducers: (builder) => {
        addCommonBuilderCasesForAsyncThunk(fetchColors, colorAdapter, builder);
    },
});

export const colorSelectors = colorAdapter.getSelectors(
    (state: RootState) => state.colorReducer
);

export const { setColors, removeColors, setLoading } = colorSlice.actions;

export const colorReducer = colorSlice.reducer;

////////////////////////////////////////

const fetchColors = createAsyncThunk(
    'color/fetchColors',
    async (arg: any, thunkApi) => {
        const res = await getRequestMaker().getColors(
            (thunkApi.getState() as RootState).authReducer.token as string
        );

        if (res === null) {
            thunkApi.dispatch(
                addAlert({
                    type: 'error',
                    message: 'Problem occured when fetching colors',
                })
            );

            return thunkApi.rejectWithValue(null);
        }

        return res;
    }
);

export const colorObserver = makeObserverOnAuthed(
    fetchColors(),
    removeColors()
);
