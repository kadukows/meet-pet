import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

type Props = {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmitCallback: (values: any) => Promise<void>;
};

const LoginDialog = (props: Props) => {
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            formik.isSubmitting = true;
            try {
                props.onSubmitCallback(values);
            } catch (e: any) {
                alert('UPS!');
            } finally {
                formik.resetForm();
            }
        },
    });

    const handleClose = React.useCallback(() => {
        formik.resetForm();
        props.setOpen(false);
    }, [formik, props]);

    return (
        <React.Fragment>
            <Dialog open={props.isOpen} onClose={handleClose}>
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
                    <Button
                        type="submit"
                        form="loginForm"
                        disabled={formik.isSubmitting}
                    >
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

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

export default LoginDialog;
