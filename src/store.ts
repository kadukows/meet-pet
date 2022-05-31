import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { observe } from 'redux-observers';
import { alertsReducer } from './features/alerts/alertsSlice';
import { darkThemeProviderReducer } from './features/darkThemeProvider/darkThemeSlice';
import { authReducer } from './features/auth/userSlice';
import { colorReducer, colorObserver } from './features/colors/colorSlice';
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
import { sizeReducer, sizeObserver } from './features/size/sizeSlice';
import {
    shelterAnimalReducer,
    shelterAnimalObserver,
} from './features/shelter/animals/animalSlice';
import {
    shelterUserAnimalRelReducer,
    shelterUserAnimalRelObserver,
} from './features/shelter/animals/userAnimalRelSlice';

const store = configureStore({
    reducer: {
        alertsReducer,
        darkThemeProviderReducer,
        authReducer,
        colorReducer,
        animalKindReducer,
        specificAnimalKindReducer,
        characterReducer,
        sizeReducer,
        shelterAnimalReducer,
        shelterUserAnimalRelReducer,
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
    shelterAnimalObserver,
    shelterUserAnimalRelObserver,
]);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
