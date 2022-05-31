import React from 'react';

import { useNavigate } from 'react-router';
import { FormikConfig, useFormik } from 'formik';
import * as yup from 'yup';

import Box, { BoxProps } from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';

import {
    Errors,
    isRequestMakerErrors,
    RegisterValues,
} from '../apiConnection/IRequestMaker';
import { MyTextField, ProfilePageLayout } from '../profile/helpers';
import AsyncButton from '../shelter/animals/AnimalDialog/AsyncButton';
import { getRequestMaker } from '../apiConnection';
import { useAppDispatch } from '../../store';
import { addAlert } from '../alerts/alertsSlice';

type FormValues = RegisterValues & {
    password2: string;
};

type Props = {};

const Register = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onSubmit = React.useCallback<FormikConfig<FormValues>['onSubmit']>(
        async (values, formikHelpers) => {
            const { password2, ...register_values } = values;
            const res = await getRequestMaker().registerAccount(
                register_values
            );

            if (isRequestMakerErrors(res)) {
                const { is_error, ...err } = res as Errors<RegisterValues>;

                formikHelpers.setErrors(err);

                return;
            }

            dispatch(
                addAlert({
                    type: 'success',
                    message: 'Sucessfully registered!',
                })
            );

            navigate('/');
        },
        [dispatch, navigate]
    );

    const formik = useFormik<FormValues>({
        initialValues: {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password2: '',
        },
        onSubmit,
        validationSchema,
    });

    return (
        <ProfilePageLayout title="Register">
            <Box
                sx={{
                    maxWidth: 'sm',
                }}
                component="form"
                onSubmit={formik.handleSubmit}
            >
                <LabelledFormField
                    label="Username"
                    //description="Used to login"
                >
                    <MyTextField
                        name="username"
                        label="Username"
                        formik={formik}
                    />
                </LabelledFormField>

                <LabelledFormField
                    label="Your name"
                    //description="Helps shelters with identifying you"
                    sx={{ mt: 3 }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <MyTextField
                            name="first_name"
                            label="First name"
                            formik={formik}
                            sx={{ flex: '1' }}
                        />
                        <MyTextField
                            name="last_name"
                            label="Last name"
                            formik={formik}
                            sx={{ flex: '1' }}
                        />
                    </Box>
                </LabelledFormField>

                <LabelledFormField
                    label="Email"
                    //description="Helps us with contacting you "
                    sx={{ mt: 3 }}
                >
                    <MyTextField name="email" label="Email" formik={formik} />
                </LabelledFormField>

                <LabelledFormField
                    label="Password"
                    //description="Helps us with contacting you "
                    sx={{ mt: 3 }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <MyTextField
                            name="password"
                            label="Password"
                            type="password"
                            formik={formik}
                            sx={{ flex: '1' }}
                        />
                        <MyTextField
                            name="password2"
                            label="Repeat password"
                            type="password"
                            formik={formik}
                            sx={{ flex: '1' }}
                        />
                    </Box>
                </LabelledFormField>

                <Box
                    sx={{
                        display: 'flex',
                        mt: 3,
                        flexDirection: 'row-reverse',
                    }}
                >
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
        </ProfilePageLayout>
    );
};

export default Register;

const validationSchema = yup.object({
    username: yup.string().required().min(3).label('Username'),
    first_name: yup.string().required().label('First name'),
    last_name: yup.string().required().label('Last name'),
    password: yup.string().required().min(1).label('Password'),
    password2: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .label('Repeat password'),
    email: yup.string().email().label('Email'),
});

type LabelledFormFieldProps = BoxProps & {
    label: string;
    description?: string;
};

const LabelledFormField = ({
    label,
    description,
    children,
    ...boxProps
}: React.PropsWithChildren<LabelledFormFieldProps>) => {
    return (
        <LabelledFieldBox {...boxProps}>
            <Typography variant="h5">{label}</Typography>
            {children}
            {description && <FormLabel>{description}</FormLabel>}
        </LabelledFieldBox>
    );
};

const LabelledFieldBox = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;
