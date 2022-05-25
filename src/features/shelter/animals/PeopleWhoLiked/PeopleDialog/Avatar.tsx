import React from 'react';

import Box from '@mui/material/Box';
import { styled, SxProps } from '@mui/material/styles';

type Props = {
    url: string;
    sx?: SxProps;
};

const Avatar = ({ url, sx }: Props) => {
    return (
        <Box sx={sx}>
            <CircularImage src={url} />
        </Box>
    );
};

export default Avatar;

const CircularImage = styled('img')`
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
