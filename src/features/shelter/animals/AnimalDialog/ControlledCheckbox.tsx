import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel, {
    FormControlLabelProps,
} from '@mui/material/FormControlLabel';

type Props = Omit<FormControlLabelProps, 'control' | 'onChange' | 'name'> & {
    formik: any;
    name: string;
};

const ControlledCheckbox = ({ formik, name, ...rest }: Props) => {
    return (
        <FormControlLabel
            control={<Checkbox checked={formik.values[name]} />}
            onChange={formik.handleChange}
            name={name}
            {...rest}
        />
    );
};

export default ControlledCheckbox;
