import React from 'react';
//import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { sleep } from '../../../../helpers';

type OnClickAsync = (
    e: React.MouseEvent<HTMLButtonElement>
) => Promise<unknown>;

type Props = ButtonProps & {
    onClick: OnClickAsync;
};

enum ActionType {
    startClick = 'startClick',
    endClick = 'endClick',
}

const AsyncButton = ({
    onClick,
    children,
    ...rest
}: React.PropsWithChildren<Props>) => {
    const [state, dispatch] = React.useReducer(reducer, {
        submitting: false,
    } as State);
    const handleClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            dispatch({
                type: ActionType.startClick,
                onClick,
                dispatch,
                e,
            });
        },
        [onClick, dispatch]
    );

    return state.submitting ? (
        <LoadingButton loading loadingPosition="center" {...rest} />
    ) : (
        <Button onClick={handleClick} children={children} {...rest} />
    );
};

export default AsyncButton;

/////////////////////////

interface State {
    submitting: boolean;
}

type Action =
    | {
          type: ActionType.startClick;
          onClick: OnClickAsync;
          dispatch: (a: any) => void;
          e: React.MouseEvent<HTMLButtonElement>;
      }
    | { type: ActionType.endClick };

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.startClick:
            if (state.submitting) {
                console.error('Already submitting');
                return state;
            }

            const decoratedOnClick = async () => {
                const sleepPromise = sleep(2000);
                await sleepPromise;
                //await Promise.all([action.onClick(action.e), sleepPromise]);
                await action.onClick(action.e);
                action.dispatch({ type: ActionType.endClick });
            };
            decoratedOnClick();

            return { submitting: true };

        case ActionType.endClick:
            return { submitting: false };
    }

    throw new Error('Action not known');
};
