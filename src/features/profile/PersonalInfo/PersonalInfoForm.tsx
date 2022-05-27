import React from 'react';

import { useFormik, FormikValues, FormikConfig } from 'formik';
import { useSelector } from 'react-redux';

import TextField, { TextFieldProps } from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';

import { RootState } from '../../../store';
import { User } from '../../auth/userSlice';
import AsyncButton from '../../shelter/animals/AnimalDialog/AsyncButton';
import { sleep } from '../../../helpers';

type InitialValues = {
    first_name: string;
    last_name: string;
    description?: string;
    has_garden?: boolean;
};

type Props = {};

const PersonalInfoForm = (props: Props) => {
    const user = useSelector(
        (state: RootState) => state.authReducer.user
    ) as User;
    const token = useSelector(
        (state: RootState) => state.authReducer.token
    ) as string;

    const formik = useFormik({
        initialValues: getInitialValues(user),
        onSubmit: async (values) => {
            console.log(values);
            await sleep(2000);
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="h5" sx={{ mb: 1 }}>
                Name
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
                <TextField
                    name="first_name"
                    label="First name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.first_name &&
                        Boolean(formik.errors.first_name)
                    }
                    helperText={
                        formik.touched.first_name && formik.errors.first_name
                    }
                    disabled={formik.isSubmitting}
                />
                <TextField
                    name="last_name"
                    label="Last name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    error={
                        formik.touched.last_name &&
                        Boolean(formik.errors.last_name)
                    }
                    helperText={
                        formik.touched.last_name && formik.errors.last_name
                    }
                    disabled={formik.isSubmitting}
                />
            </Box>
            <FormLabel>
                Publicly available name, shelters will have an access to it.
            </FormLabel>
            {}
            {user.user_prefs && (
                <React.Fragment>
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        Description
                    </Typography>
                    <MyTextField
                        label="Description"
                        name="description"
                        formik={formik}
                        minRows={4}
                        multiline
                    />
                    <FormLabel>
                        Shelters could look at your description and decide if
                        they want to continue with adoption process.
                    </FormLabel>
                    <Typography variant="h5" sx={{ mt: 3 }}>
                        About you
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={formik.values.has_garden}
                                onChange={formik.handleChange}
                                name="has_garden"
                                disabled={formik.isSubmitting}
                            />
                        }
                        label="I have a garden"
                    />
                    <FormLabel>
                        Shelters will try to match you with best matching animal
                        according to this info.
                    </FormLabel>
                </React.Fragment>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <AsyncButton
                    loading={formik.isSubmitting}
                    variant="contained"
                    type="submit"
                >
                    Submit
                </AsyncButton>
            </Box>
        </form>
    );
};

export default PersonalInfoForm;

const getInitialValues = (user: User) => {
    const result: InitialValues = {
        first_name: user.first_name,
        last_name: user.last_name,
    };

    if (user.user_prefs) {
        result.description = user.user_prefs.description;
        result.has_garden = user.user_prefs.has_garden;
    }

    return result;
};

type MyTextFieldProps = TextFieldProps & {
    name: string;
    formik: any;
};

const MyTextField = ({ formik, name, ...textFieldProps }: MyTextFieldProps) => {
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
