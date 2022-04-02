import React from 'react';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { setUserTokenAuth } from './userSlice';
import { addAlert } from '../alerts/alertsSlice';
import LoginDialog from './LoginDialog';
import { getRequestMaker } from '../apiConnection';

type Props = {};

const Login = (props: Props) => {
    const [open, setOpen] = React.useState(false);

    const dispatch = useDispatch();
    const onSubmitCallback = React.useCallback(
        async (values) => {
            try {
                const token = await getRequestMaker().getToken(
                    values.username,
                    values.password
                );
                if (token === null) {
                    throw new Error('');
                }

                const user = await getRequestMaker().getUser(token);
                if (user === null) {
                    throw new Error('');
                }

                // This prevents "leak" message in js debug console
                setTimeout(() => {
                    dispatch(
                        setUserTokenAuth({
                            token: token,
                            user: user,
                        })
                    );
                    dispatch(
                        addAlert({
                            message: 'Logged in!',
                            type: null,
                        })
                    );
                }, 250);

                setOpen(false);
            } catch (e: any) {
                dispatch(
                    addAlert({
                        message: 'Invalid username or password!',
                        type: 'warning',
                    })
                );
            }
        },
        [dispatch]
    );

    return (
        <React.Fragment>
            <Button color="inherit" onClick={() => setOpen(true)}>
                Login
            </Button>
            <LoginDialog
                isOpen={open}
                setOpen={setOpen}
                onSubmitCallback={onSubmitCallback}
            />
        </React.Fragment>
    );
};

export default Login;
