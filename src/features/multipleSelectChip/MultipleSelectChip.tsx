import React from 'react';
import Paper from '@mui/material/Paper';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Color } from '../colors/colorSlice';

interface MyDict<T> {
    [k: number]: T | undefined;
}

interface StandardEnumValue {
    id: number;
    value: string;
}

type Props = {
    selectorAll: (state: RootState) => MyDict<StandardEnumValue>;
    formik: any;
    name: string;
    label?: string;
    sx?: SxProps<Theme>;
};

const MultipleSelectChip = (props: Props) => {
    const dictObjects = useSelector(props.selectorAll);

    return (
        <TextField
            select
            sx={props.sx}
            label={props.label}
            name={props.name}
            value={props.formik.values[props.name]}
            onChange={props.formik.handleChange}
            helperText={props.formik.touched.email && props.formik.errors.email}
            error={
                props.formik.touched.email && Boolean(props.formik.errors.email)
            }
            SelectProps={{
                multiple: true,
                renderValue: (selected: any) => (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                        }}
                    >
                        {selected.map((value: number) => (
                            <Chip
                                key={value}
                                label={dictObjects[value]?.value}
                            />
                        ))}
                    </Box>
                ),
            }}
        >
            {(
                Object.values(
                    dictObjects
                ) as unknown as Array<StandardEnumValue>
            ).map((enumValue: StandardEnumValue) => (
                <MenuItem key={enumValue.id} value={enumValue.id}>
                    {enumValue.value}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default MultipleSelectChip;
