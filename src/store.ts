import { configureStore } from '@reduxjs/toolkit';
import { observe } from 'redux-observers';
import { countReducer } from './features/counter/counterSlice';
import { alertsReducer } from './features/alerts/alertsSlice';
import { darkThemeProviderReducer } from './features/darkThemeProvider/darkThemeSlice';
import { authReducer } from './features/auth/userSlice';
import { colorReducer, colorObserver } from './features/colors/colorSlice';
import { sizeReducer, sizeObserver } from './features/size/sizeSlice';
import {
    animalKindReducer,
    animalKindObserver,
} from './features/animalKind/animaKindSlice';
import {
    specificAnimalKindReducer,
    specificAnimalKindObserver,
} from './features/specificAnimalKind/specificAnimalKindSlice';
import {
    characterReducer,
    characterObserver,
} from './features/characters/charcterSlice';

const store = configureStore({
    reducer: {
        countReducer: countReducer,
        alertsReducer,
        darkThemeProviderReducer,
        authReducer,
        colorReducer,
        animalKindReducer,
        specificAnimalKindReducer,
        characterReducer,
        sizeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export { store };

observe(store, [
    colorObserver,
    animalKindObserver,
    specificAnimalKindObserver,
    characterObserver,
    sizeObserver,
]);
