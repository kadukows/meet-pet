import { styled, css } from '@mui/material/styles';

export const MarginedForm = styled('form')(
    ({ theme }) => css`
        margin-top: ${theme.spacing(1)};
        display: flex;
        gap: ${theme.spacing(2)};
        flex-direction: column;
    `
);
