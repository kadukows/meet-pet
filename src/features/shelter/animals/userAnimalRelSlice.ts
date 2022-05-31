import { createCommonObjectReducerAndStuff, sleep } from '../../../helpers';
import { getRequestMaker } from '../../apiConnection';

import {
    Animal,
    UserAnimalLikeRelation,
    UserAnimalLikeRelationState,
} from '../../animal/animalSlice';
import { observer } from 'redux-observers';
import { RootState } from '../../../store';
import { UserType } from '../../auth/userSlice';
import { makeObserverForShelterAccount } from './helpers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { addAlert } from '../../alerts/alertsSlice';

const reducerAndStuff =
    createCommonObjectReducerAndStuff<UserAnimalLikeRelation>(
        (token) => getRequestMaker().getUserAnimalRelations(token),
        'shelterUserAnimalRel'
    );

export const shelterUserAnimalRelSelectors = reducerAndStuff.selectors;
export const shelterUserAnimalRelReducer = reducerAndStuff.reducer;
export const shelterUserAnimalRelActions = reducerAndStuff.actions;
export const shelterUserAnimalRelObserver = makeObserverForShelterAccount(
    reducerAndStuff.fetchAction() as any,
    shelterUserAnimalRelActions.removeAll()
);

type SetRelationStateActionArg = {
    user_relation_id: number;
    state: UserAnimalLikeRelationState;
    token: string;
};

export const setRelationStateAction = createAsyncThunk<
    boolean,
    SetRelationStateActionArg
>(
    'shelterUserAnimalRel/setRelationState',
    async ({ user_relation_id, state, token }, thunkApi) => {
        thunkApi.dispatch(
            shelterUserAnimalRelActions.updateOne({
                id: user_relation_id,
                changes: {
                    is_updating: true,
                },
            })
        );

        let requestResult: true | null = null;

        switch (state) {
            case UserAnimalLikeRelationState.ACCEPTED:
                requestResult =
                    await getRequestMaker().shelter.userAnimalRel.accept(
                        token,
                        user_relation_id
                    );
                break;
            case UserAnimalLikeRelationState.NOT_ACCEPTED:
                requestResult =
                    await getRequestMaker().shelter.userAnimalRel.no_accept(
                        token,
                        user_relation_id
                    );
                break;
        }

        if (requestResult === true) {
            thunkApi.dispatch(
                addAlert({
                    type: 'success',
                    message: 'Sucessfully updated',
                })
            );

            thunkApi.dispatch(
                shelterUserAnimalRelActions.updateOne({
                    id: user_relation_id,
                    changes: {
                        is_updating: false,
                        state: state,
                    },
                })
            );

            return true;
        } else {
            thunkApi.dispatch(
                addAlert({
                    type: 'error',
                    message: 'Something went wrong',
                })
            );

            thunkApi.dispatch(
                shelterUserAnimalRelActions.updateOne({
                    id: user_relation_id,
                    changes: {
                        is_updating: false,
                    },
                })
            );
        }

        return false;
    }
);
