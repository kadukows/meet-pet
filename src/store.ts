import { configureStore } from '@reduxjs/toolkit';
import { countReducer } from './features/counter/counterSlice';
import { alertsReducer } from './features/alerts/alertsSlice';
import { darkThemeProviderReducer } from './features/darkThemeProvider/darkThemeSlice';

const store = configureStore({
    reducer: {
        countReducer: countReducer,
        alertsReducer,
        darkThemeProviderReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export { store };
