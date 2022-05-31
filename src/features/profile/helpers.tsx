import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

export type ProfilePageLayoutProps = {
    title: string;
};

export const ProfilePageLayout = ({
    title,
    children,
}: React.PropsWithChildren<ProfilePageLayoutProps>) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h2">{title}</Typography>
            <Divider sx={{ mt: 1, mb: 3 }} />
            {children}
        </Box>
    );
};

type MyTextFieldProps = TextFieldProps & {
    name: string;
    formik: any;
};

export const MyTextField = ({
    formik,
    name,
    ...textFieldProps
}: MyTextFieldProps) => {
    return (
        <TextField
            name={name}
            {...textFieldProps}
            value={formik.values[name]}
            onChange={formik.handleChange}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            disabled={formik.isSubmitting}
        />
    );
};

export const FlexForm = styled('form')`
    display: flex;
    flex-direction: column;
`;
