import React from 'react';

import Box from '@mui/material/Box';

import { ProfilePageLayout } from '../helpers';

import PersonalInfoForm from './PersonalInfoForm';
import AvatarEdit from './AvatarEdit';

type Props = {};

const PersonalInfo = (props: Props) => {
    return (
        <ProfilePageLayout title="Personal Info">
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: '50%' }}>
                    <PersonalInfoForm />
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                    <AvatarEdit />
                </Box>
            </Box>
        </ProfilePageLayout>
    );
};

export default PersonalInfo;
