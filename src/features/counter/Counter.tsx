import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { addOne, addMany } from './counterSlice';
import { RootState } from '../../store';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { css } from '@emotion/react';
import { addAlert } from '../alerts/alertsSlice';
import LoginButton from '../auth/LoginButton';

type Props = {
    text?: string;
};

const Counter = (props: Props) => {
    const t = props.text ? props.text : 'Counter';

    const count = useSelector((state: RootState) => state.countReducer.count);
    const dispatch = useDispatch();

    const callback = React.useCallback(() => dispatch(addOne()), [dispatch]);
    const callback2 = React.useCallback(() => dispatch(addMany(5)), [dispatch]);
    const callback3 = React.useCallback(async () => {
        const res = await fetch('/headers_items', { method: 'GET' });

        console.log('res: ', await res.json());
    }, []);

    const sendNotification = React.useCallback(
        () => dispatch(addAlert({ type: 'success', message: 'Notification!' })),
        [dispatch]
    );

    return (
        <Container>
            <Item>
                {t}: {count}
                <Button
                    onClick={callback}
                    color="secondary"
                    sx={{ ml: 2 }}
                    variant="contained"
                >
                    Click me
                </Button>
            </Item>
            <Item>
                {t + '2'}: {count}
                <button onClick={callback2}>Click me2</button>
            </Item>
            <Item>
                <Button variant="contained" onClick={sendNotification}>
                    Notify me!
                </Button>
            </Item>
            <Item>
                <Button variant="contained" onClick={callback3}>
                    Request!
                </Button>
            </Item>
        </Container>
    );
};

export default Counter;

const Container = styled(Box)`
    display: inline-flex;
    flex-direction: column;
`;

const Item = styled(Box)(
    ({ theme }) => css`
        margin-top: ${theme.spacing(2)};
    `
);
