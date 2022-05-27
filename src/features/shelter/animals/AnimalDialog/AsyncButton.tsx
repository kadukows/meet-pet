import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled, css } from '@mui/material/styles';

enum ActionType {
    startClick = 'startClick',
    endClick = 'endClick',
}

///////////////

type OnClickAsync = (
    e: React.MouseEvent<HTMLButtonElement>
) => Promise<unknown>;

type AsyncButtonDerivedFromOnClickProps = {
    onClick: OnClickAsync;
};

type AsyncButtonControlledProps = {
    loading: boolean;
};

type Props =
    | ButtonProps
    | AsyncButtonDerivedFromOnClickProps
    | AsyncButtonControlledProps;

type ImplProps = ButtonProps &
    Partial<AsyncButtonDerivedFromOnClickProps> &
    Partial<AsyncButtonControlledProps>;

const AsyncButton = (p: React.PropsWithChildren<Props>) => {
    const { onClick, loading, children, ...rest } = p as ImplProps;

    const [state, dispatch] = React.useReducer(reducer, {
        submitting: false,
    } as State);
    const handleClick = React.useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            if (onClick) {
                dispatch({
                    type: ActionType.startClick,
                    onClick,
                    dispatch,
                    e,
                });
            }
        },
        [onClick, dispatch]
    );

    return state.submitting || !!loading ? (
        <LoadingButtonWithWhiteIndicator
            loading={true}
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

const LoadingButtonWithWhiteIndicator = styled(LoadingButton)(({ theme }) => {
    if (theme.palette.mode === 'dark') {
        return css`
            > .MuiLoadingButton-loadingIndicator {
                color: white;
            }
        `;
    }

    return '';
});
