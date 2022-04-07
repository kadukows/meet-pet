import { createCommonObjectReducerAndStuff } from '../../helpers';
import { getRequestMaker } from '../apiConnection';

export interface Character {
    id: number;
    value: string;
}

const reducerAndStuff = createCommonObjectReducerAndStuff<Character>(
    (token) => getRequestMaker().getCharacters(token),
    'character'
);

export const characterSelectors = reducerAndStuff.selectors;
export const characterReducer = reducerAndStuff.reducer;
export const characterActions = reducerAndStuff.actions;
export const characterObserver = reducerAndStuff.observer;
