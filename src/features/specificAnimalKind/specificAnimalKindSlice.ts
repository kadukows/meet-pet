import { createCommonObjectReducerAndStuff } from '../../helpers';
import { getRequestMaker } from '../apiConnection';

export interface SpecificAnimalKind {
    id: number;
    value: string;
    animal_kind_id: number;
}

const reducerAndStuff = createCommonObjectReducerAndStuff<SpecificAnimalKind>(
    (token) => getRequestMaker().getSpecificAnimalKinds(token),
    'specificAnimalKind'
);

export const specificAnimalKindSelectors = reducerAndStuff.selectors;
export const specificAnimalKindReducer = reducerAndStuff.reducer;
export const specificAnimalKindActions = reducerAndStuff.actions;
export const specificAnimalKindObserver = reducerAndStuff.observer;
