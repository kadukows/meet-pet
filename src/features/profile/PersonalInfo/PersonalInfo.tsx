import React from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import PersonalInfoForm from './PersonalInfoForm';
import AvatarEdit from './AvatarEdit';

type Props = {};

const PersonalInfo = (props: Props) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h2">Personal Info</Typography>
            <Divider sx={{ mt: 1, mb: 3 }} />
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '50%' }}>
                    <PersonalInfoForm />
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                    <AvatarEdit />
                </Box>
            </Box>
        </Box>
    );
};

export default PersonalInfo;
