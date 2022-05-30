import React from 'react';

import * as yup from 'yup';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';

import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { RootState } from '../../../store';
import { User } from '../../auth/userSlice';
import { MyTextField, FlexForm } from '../helpers';

type FormValues = {
    new_password: string;
    new_password2: string;
    email: string;
};

type Props = {};

const AccountInfoForm = (props: Props) => {
    const user = useSelector(
        (state: RootState) => state.authReducer.user
    ) as User;

    const onSubmit = React.useCallback(async () => {}, []);

    const formik = useFormik<FormValues>({
        initialValues: {
            new_password: '',
            new_password2: '',
            email: user.email,
        },
        onSubmit,
        validationSchema,
    });

    return (
        <FlexForm>
            <Typography variant="h5">Password</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <MyTextField name="new_password" formik={formik} />
                <MyTextField name="new_password2" formik={formik} />
            </Box>
        </FlexForm>
    );
};

export default AccountInfoForm;

///////////

const validationSchema = yup.object({
    new_password: yup.string().label('New password'),
    new_password2: yup
        .string()
        .oneOf([yup.ref('new_password')], 'Password must match!')
        .label('Repeat password'),
    email: yup.string().email().label('Email'),
});
