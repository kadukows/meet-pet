import React from 'react';

import * as yup from 'yup';
import { useFormik, FormikConfig, FormikErrors } from 'formik';
import { useSelector } from 'react-redux';

import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { RootState, useAppDispatch } from '../../../store';
import { updateAccountInfo, User } from '../../auth/userSlice';
import { MyTextField, FlexForm } from '../helpers';
import { getRequestMaker } from '../../apiConnection';
import {
    AccountInfo,
    Errors,
    isRequestMakerErrors,
} from '../../apiConnection/IRequestMaker';
import { addAlert } from '../../alerts/alertsSlice';
import AsyncButton from '../../shelter/animals/AnimalDialog/AsyncButton';

type FormValues = {
    new_password: string;
    new_password2: string;
    email: string;
};

type Props = {};

const AccountInfoForm = (props: Props) => {
    const { user, token } = useSelector(
        (state: RootState) => state.authReducer
    );
    const dispatch = useAppDispatch();

    const onSubmit = React.useCallback<FormikConfig<FormValues>['onSubmit']>(
        async ({ new_password, email }, formikHelpers) => {
            const res = await getRequestMaker().updateAccountInfo(
                token as string,
                {
                    password: new_password.length > 0 ? new_password : null,
                    email: email.length > 0 ? email : null,
                }
            );

            if (isRequestMakerErrors(res)) {
                const e = res as Errors<AccountInfo>;

                const formikErrors: FormikErrors<FormValues> = {};
                if (e.password !== undefined)
                    formikErrors.new_password = e.password;
                if (e.email !== undefined) formikErrors.email = e.email;
                formikHelpers.setErrors(formikErrors);

                return;
            }

            if (res.email !== undefined && res.email !== null) {
                dispatch(
                    updateAccountInfo({
                        email: res.email,
                    })
                );

                formikHelpers.setFieldValue('email', res.email);
            }

            formikHelpers.setFieldValue('new_password', '');
            formikHelpers.setFieldValue('new_password2', '');

            dispatch(
                addAlert({
                    type: 'success',
                    message: 'Sucessfully updated account info!',
                })
            );
        },
        [token]
    );

    const formik = useFormik<FormValues>({
        initialValues: {
            new_password: '',
            new_password2: '',
            email: user?.email ?? '',
        },
        onSubmit,
        validationSchema,
    });

    return (
        <Box
            component="form"
            sx={{ maxWidth: 'sm', display: 'flex', flexDirection: 'column' }}
            onSubmit={formik.handleSubmit}
        >
            <Typography variant="h5">Password</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <MyTextField
                    name="new_password"
                    label="Password"
                    type="password"
                    formik={formik}
                    sx={{ flex: '1' }}
                />
                <MyTextField
                    name="new_password2"
                    label="Repeat password"
                    type="password"
                    formik={formik}
                    sx={{ flex: '1' }}
                />
            </Box>
            <FormLabel>You can change your password here</FormLabel>
            <Typography variant="h5" sx={{ mt: 3 }}>
                Email
            </Typography>
            <MyTextField name="email" label="Email" formik={formik} />
            <FormLabel>Used to contact you</FormLabel>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mt: 3 }}>
                <AsyncButton
                    loading={formik.isSubmitting}
                    disabled={!formik.dirty}
                    type="submit"
                    variant="contained"
                >
                    Submit
                </AsyncButton>
            </Box>
        </Box>
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
    email: yup.string().required().email().label('Email'),
});
