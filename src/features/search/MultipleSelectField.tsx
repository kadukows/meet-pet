import React from 'react';
import TextField from '@mui/material/TextField';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';

interface Object {
    id: number;
    value: string;
}

type Props = {
    name: string;
    label: string;
    formik: any;
    selectAll: (state: RootState) => Object[];
    selectEntities: (state: RootState) => { [n: number]: Object | undefined };
};

const MultipleSelectField = ({
    name,
    label,
    formik,
    selectAll,
    selectEntities,
}: Props) => {
    const objects = useSelector(selectAll);
    const objectsByIds = useSelector(selectEntities);

    return (
        <TextField
            name={name}
            label={label}
            value={formik.values[name]}
            onChange={formik.handleChange}
            select
            SelectProps={{
                multiple: true,
            }}
            fullWidth
        >
            {objects.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                    {o.value}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default MultipleSelectField;
