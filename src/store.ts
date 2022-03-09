import { configureStore } from '@reduxjs/toolkit';
import { countReducer } from './features/counter/counterSlice';

const store = configureStore({
    reducer: {
        countReducer: countReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export { store };
