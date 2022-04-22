import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import BrowserNotSupportedIcon from '@mui/icons-material/BrowserNotSupported';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { styled } from '@mui/system';

type Props = {
    name: string;
    label: string;
    formik: any;
};

export enum Ternary {
    False = 'False',
    True = 'True',
    Indeterminate = 'Indeterminate',
}

const TernaryField = ({ name, label, formik }: Props) => {
    return (
        <TextField
            name={name}
            label={label}
            value={formik.values[name]}
            onChange={formik.handleChange}
            select
            fullWidth
        >
            {Object.values(Ternary).map((t) => (
                <MenuItem key={t} value={t}>
                    {renderTernary(t)}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default TernaryField;

////////////////////

const TernaryItemContainer = styled('div')`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
`;

const renderTernary = (t: Ternary) => {
    switch (t) {
        case Ternary.True:
            return (
                <TernaryItemContainer>
                    <CheckIcon />
                    {'Yes'}
                </TernaryItemContainer>
            );
        case Ternary.False:
            return (
                <TernaryItemContainer>
                    <BrowserNotSupportedIcon />
                    {'No'}
                </TernaryItemContainer>
            );
        default:
            break;
    }

    return (
        <TernaryItemContainer>
            <HelpOutlineIcon />
            {'Unknown'}
        </TernaryItemContainer>
    );
};

export const translateTernary = (t: Ternary): boolean | null => {
    switch (t) {
        case Ternary.True:
            return true;
        case Ternary.False:
            return false;
        default:
            break;
    }

    return null;
};
