import React from 'react';
import Button from '@mui/material/Button';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { resetAuth, setUserTokenAuth } from './userSlice';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { addAlert } from '../alerts/alertsSlice';
import LoginDialog from './LoginDialog';

type Props = {};

const LoginButton = (props: Props) => {
    const authed = useSelector(
        (state: RootState) =>
            state.authReducer.token != null && !state.authReducer.loading
    );

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
            {authed ? (
                <MenuButton />
            ) : (
                <Button color="inherit" onClick={() => setOpen(true)}>
                    Login
                </Button>
            )}
            <LoginDialog
                isOpen={open}
                setOpen={setOpen}
                onSubmitCallback={onSubmitCallback}
            />
        </React.Fragment>
    );
};

export default LoginButton;

const MenuButton = () => {
    const fullName = useSelector(
        (state: RootState) => state.authReducer.user?.full_name
    );

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const dispatch = useDispatch();
    const logoutCallback = React.useCallback(() => {
        dispatch(resetAuth());
        dispatch(
            addAlert({
                message: 'Logged out!',
                type: null,
            })
        );
    }, [dispatch]);

    return (
        <React.Fragment>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                color="inherit"
            >
                {fullName}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={logoutCallback}>Logout</MenuItem>
            </Menu>
        </React.Fragment>
    );
};
