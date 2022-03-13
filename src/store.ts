import { configureStore } from '@reduxjs/toolkit';
import { countReducer } from './features/counter/counterSlice';
import { alertsReducer } from './features/alerts/alertsSlice';
import { darkThemeProviderReducer } from './features/darkThemeProvider/darkThemeSlice';
import { authReducer } from './features/auth/userSlice';

const store = configureStore({
    reducer: {
        countReducer: countReducer,
        alertsReducer,
        darkThemeProviderReducer,
        authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export { store };
