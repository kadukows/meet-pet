import { configureStore } from '@reduxjs/toolkit';
import { observe } from 'redux-observers';
import { countReducer } from './features/counter/counterSlice';
import { alertsReducer } from './features/alerts/alertsSlice';
import { darkThemeProviderReducer } from './features/darkThemeProvider/darkThemeSlice';
import { authReducer } from './features/auth/userSlice';
import { colorReducer, colorObserver } from './features/colors/colorSlice';

const store = configureStore({
    reducer: {
        countReducer: countReducer,
        alertsReducer,
        darkThemeProviderReducer,
        authReducer,
        colorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export { store };

observe(store, [colorObserver]);
