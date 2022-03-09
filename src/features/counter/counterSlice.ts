import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

export interface CountState {
    count: number;
}

const initialState: CountState = {
    count: 0,
};

const countSlice = createSlice({
    name: 'count',
    initialState: initialState,
    reducers: {
        addOne: (state: CountState) => {
            state.count += 1;
        },
        addMany: (state: CountState, payload: PayloadAction<number>) => {
            state.count += payload.payload;
        },
    },
});

const countReducer = countSlice.reducer;
const { addOne, addMany } = countSlice.actions;

export { countReducer, addOne, addMany };
