import React from 'react';

import * as yup from 'yup';
import { FormikConfig, useFormik } from 'formik';
import { useSelector } from 'react-redux';

import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { RootState, useAppDispatch } from '../../../store';
import { updateAccountInfo, User } from '../../auth/userSlice';
import { MyTextField, FlexForm } from '../helpers';
import AsyncButton from '../../shelter/animals/AnimalDialog/AsyncButton';
import { getRequestMaker } from '../../apiConnection';
import { addAlert } from '../../alerts/alertsSlice';

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
    const token = useSelector(
        (state: RootState) => state.authReducer.token
    ) as string;
    const dispatch = useAppDispatch();

    const onSubmit = React.useCallback<FormikConfig<FormValues>['onSubmit']>(
        async ({ email, new_password }, formikHelpers) => {
            const res = await getRequestMaker().updateAccountInfo(token, {
                email: email.length > 0 ? email : null,
                password: new_password.length > 0 ? new_password : null,
            });

            if (res === null) {
                dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Something went wrong',
                    })
                );

                return;
            }

            dispatch(
                addAlert({
                    type: 'success',
                    message: 'Account info sucessfully updated',
                })
            );

            dispatch(updateAccountInfo(res));

            formikHelpers.resetForm({
                values: {
                    email: res.email ?? '',
                    new_password: '',
                    new_password2: '',
                },
            });
        },
        [token, dispatch]
    );

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
        <HalfFlexForm onSubmit={formik.handleSubmit}>
            <Typography variant="h5">Password</Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'space-between',
                }}
            >
                <MyTextField
                    sx={{ flex: 1 }}
                    name="new_password"
                    label="Password"
                    formik={formik}
                    type="password"
                />
                <MyTextField
                    sx={{ flex: 1 }}
                    name="new_password2"
                    label="Repeat password"
                    formik={formik}
                    type="password"
                />
            </Box>
            <FormLabel>You can change your password here</FormLabel>
            <Typography variant="h5" sx={{ mt: 3 }}>
                Email
            </Typography>
            <MyTextField name="email" label="Email" formik={formik} />
            <FormLabel>We use your email to contact you</FormLabel>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <AsyncButton
                    loading={formik.isSubmitting}
                    variant="contained"
                    type="submit"
                    disabled={!formik.dirty}
                >
                    Submit
                </AsyncButton>
            </Box>
        </HalfFlexForm>
    );
};

export default AccountInfoForm;

///////////

const validationSchema = yup.object({
    new_password: yup.string().label('New password'),
    new_password2: yup
        .string()
        .oneOf([yup.ref('new_password')], 'Passwords must match!')
        .label('Repeat password'),
    email: yup.string().email().label('Email'),
});

const HalfFlexForm = styled(FlexForm)`
    width: 50%;
`;
