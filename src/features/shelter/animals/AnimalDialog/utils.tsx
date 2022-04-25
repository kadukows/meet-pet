import TextField, { TextFieldProps } from '@mui/material/TextField';
import { styled, css } from '@mui/material/styles';

export const MarginedForm = styled('form')(
    ({ theme }) => css`
        margin-top: ${theme.spacing(1)};
        display: flex;
        gap: ${theme.spacing(2)};
        flex-direction: column;
    `
);

type FormikTextFieldProps = TextFieldProps & {
    formik: any;
    name: string;
};

export const FormikTextField = ({
    formik,
    name,
    ...rest
}: FormikTextFieldProps) => {
    return (
        <TextField
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            {...rest}
        />
    );
};
