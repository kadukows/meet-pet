import { createCommonObjectReducerAndStuff } from '../../../helpers';
import { getRequestMaker } from '../../apiConnection';

import { Animal } from '../../animal/animalSlice';
import { observer } from 'redux-observers';
import { RootState } from '../../../store';
import { UserType } from '../../auth/userSlice';

const reducerAndStuff = createCommonObjectReducerAndStuff<Animal>(
    (token) => getRequestMaker().shelter.getOwnAnimals(token),
    'shelterAnimal'
);

export const shelterAnimalSelectors = reducerAndStuff.selectors;
export const shelterAnimalReducer = reducerAndStuff.reducer;
export const shelterAnimalActions = reducerAndStuff.actions;
export const shelterAnimalObserver = observer(
    (state: RootState) => ({
        authed: state.authReducer.authorized,
        user_type: state.authReducer.user?.user_type,
    }),
    (dispatch, current, previous) => {
        if (current.authed === true && previous?.authed === false) {
            if (current.user_type === UserType.Shelter) {
                dispatch(reducerAndStuff.fetchAction() as any);
            }
        } else if (current.authed === false && previous?.authed === true) {
            dispatch(shelterAnimalActions.removeAll());
        }
    }
);
