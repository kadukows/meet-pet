import { Action } from 'redux';
import { observer } from 'redux-observers';
import { RootState } from '../../../store';
import { UserType } from '../../auth/userSlice';

export const makeObserverForShelterAccount = (
    fetchAction: Action,
    removeAction: Action
) => {
    return observer(
        (state: RootState) => ({
            authed: state.authReducer.authorized,
            user_type: state.authReducer.user?.user_type,
        }),
        (dispatch, current, previous) => {
            if (current.authed === true && previous?.authed === false) {
                if (current.user_type == UserType.Shelter) {
                    dispatch(fetchAction);
                }
            } else if (current.authed === false && previous?.authed === true) {
                dispatch(removeAction);
            }
        }
    );
};
