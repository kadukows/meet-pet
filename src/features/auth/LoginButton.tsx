import React from 'react';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUserTokenAuth } from './userSlice';
import { addAlert } from '../alerts/alertsSlice';
import LoginDialog from './LoginDialog';

type Props = {};

const LoginButton = (props: Props) => {
    const [open, setOpen] = React.useState(false);

    const dispatch = useDispatch();
    const onSubmitCallback = React.useCallback(
        async (values) => {
            try {
                const formData = new FormData();
                formData.append('username', values.username);
                formData.append('password', values.password);

                const res = await axios.post<any>('/token', formData);

                const user = await axios.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${res.data.access_token}`,
                    },
                });

                dispatch(
                    setUserTokenAuth({
                        token: res.data.access_token,
                        user: user.data,
                    })
                );
                dispatch(
                    addAlert({
                        message: 'Logged in!',
                        type: null,
                    })
                );
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

export default LoginButton;
