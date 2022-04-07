import { createCommonObjectReducerAndStuff } from '../../helpers';
import { getRequestMaker } from '../apiConnection';

export interface AnimalKind {
    id: number;
    value: string;
}

const reducerAndStuff = createCommonObjectReducerAndStuff<AnimalKind>(
    (token) => getRequestMaker().getAnimalKinds(token),
    'animalKind'
);

export const animalKindSelectors = reducerAndStuff.selectors;
export const animalKindReducer = reducerAndStuff.reducer;
export const animalKindActions = reducerAndStuff.actions;
export const animalKindObserver = reducerAndStuff.observer;
