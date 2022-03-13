import React from 'react';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';
import { resetAuth, setUserTokenAuth } from './userSlice';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { addAlert } from '../alerts/alertsSlice';

type Props = {};

async function sleep(time: number) {
    return new Promise((res, rej) => setTimeout(() => res(null), time));
}

const LoginButton = (props: Props) => {
    const [error, setError] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const handleOpen = React.useCallback(() => setOpen(true), []);
    const handleClose = React.useCallback(() => setOpen(false), []);

    const authed = useSelector(
        (state: RootState) =>
            state.authReducer.token != null && !state.authReducer.loading
    );

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
                alert('Error');
            }
        },
        [dispatch]
    );

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: onSubmitCallback,
    });

    return (
        <React.Fragment>
            {authed ? (
                <MenuButton />
            ) : (
                <Button color="inherit" onClick={handleOpen}>
                    Login
                </Button>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <form id="loginForm" onSubmit={formik.handleSubmit}>
                        <TextField
                            sx={{ mt: 2 }}
                            fullWidth
                            id="username"
                            name="username"
                            label="Username"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.username &&
                                Boolean(formik.errors.username)
                            }
                            helperText={
                                formik.touched.username &&
                                formik.errors.username
                            }
                            disabled={formik.isSubmitting}
                        />
                        <TextField
                            sx={{ mt: 2 }}
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={
                                formik.touched.password &&
                                Boolean(formik.errors.password)
                            }
                            helperText={
                                formik.touched.password &&
                                formik.errors.password
                            }
                            disabled={formik.isSubmitting}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" form="loginForm">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default LoginButton;

//////////////////////

const validationSchema = yup.object({
    username: yup
        .string
        //'Enter your username'
        ()
        .required('Username is required'),
    password: yup
        .string //'Enter your password'
        ()
        //.min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

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
