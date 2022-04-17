import { createCommonObjectReducerAndStuff } from '../../helpers';
import { getRequestMaker } from '../apiConnection';

export interface Size {
    id: number;
    value: string;
}

const reducerAndStuff = createCommonObjectReducerAndStuff<Size>(
    (token) => getRequestMaker().getSizes(token),
    'size'
);

export const sizeSelectors = reducerAndStuff.selectors;
export const sizeReducer = reducerAndStuff.reducer;
export const sizeActions = reducerAndStuff.actions;
export const sizeObserver = reducerAndStuff.observer;
