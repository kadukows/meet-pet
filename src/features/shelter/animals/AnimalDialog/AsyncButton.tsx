import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';

import { sleep } from '../../../../helpers';

type OnClickAsync = (
    e: React.MouseEvent<HTMLButtonElement>
) => Promise<unknown>;

type Props = ButtonProps & {
    onClick: OnClickAsync;
    onStart?: () => void;
};

enum ActionType {
    startClick = 'startClick',
    endClick = 'endClick',
}

const AsyncButton = ({
    onClick,
    children,
    onStart,
    ...rest
}: React.PropsWithChildren<Props>) => {
    const [state, dispatch] = React.useReducer(reducer, {
        submitting: false,
    } as State);
    const handleClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            if (onStart) {
                onStart();
            }
            dispatch({
                type: ActionType.startClick,
                onClick,
                dispatch,
                e,
            });
        },
        [onClick, dispatch, onStart]
    );

    return state.submitting ? (
        <LoadingButtonWithWhiteIndicator
            loading
            disabled
            loadingPosition="center"
            children={children}
            {...rest}
        />
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

const LoadingButtonWithWhiteIndicator = styled(LoadingButton)`
    > .MuiLoadingButton-loadingIndicator {
        color: white;
    }
`;
