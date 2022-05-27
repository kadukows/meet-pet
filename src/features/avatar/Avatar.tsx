import React from 'react';

import Box from '@mui/material/Box';
import { styled, SxProps } from '@mui/material/styles';
import { User } from '../auth/userSlice';

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

export type AvatarProps = Props;

export const getUserAvatarUrl = (user: User | null) => {
    return (
        user?.user_prefs?.avatar ??
        'https://www.gravatar.com/avatar/0365e3991122d45a6c7fb738ccb82903?size=192&d=mm'
    );
};
