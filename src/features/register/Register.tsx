import React from 'react';

import { useNavigate } from 'react-router';
import { FormikConfig, useFormik } from 'formik';

import * as yup from 'yup';

type FormValues = RegisterValues & {
    password2: string;
};

type Props = {};

const Register = (props: Props) => {
    const navigate = useNavigate();

    const onSubmit = React.useCallback<FormikConfig<FormValues>['onSubmit']>(
        async (values) => {},
        []
    );

    const formik = useFormik<FormValues>({
        initialValues: {
            username: '',
            email: '',
            password: '',
            password2: '',
            description: '',
        },
        onSubmit,
        validationSchema,
    });

    return <div />;
};

export default Register;

const validationSchema = yup.object({
    username: yup.string().required().min(6).label('Username'),
    password: yup.string().required().min(8).label('Password'),
    password2: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .label('Repeat password'),
    email: yup.string().email().label('Email'),
    //
    description: yup.string().min(5),
});
