import React from 'react';

import { ProfilePageLayout } from '../helpers';
import AccountInfoForm from './AccountInfoForm';

type Props = {};

const AccountInfo = (props: Props) => {
    return (
        <ProfilePageLayout title="Account Info">
            <AccountInfoForm />
        </ProfilePageLayout>
    );
};

export default AccountInfo;
