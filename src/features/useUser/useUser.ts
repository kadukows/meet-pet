import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { User } from '../auth/userSlice';

interface UserObject extends User {
    getLikedAnimals: () => Set<number>;
}

export const useUser = (): UserObject => {
    const reduxUser = useSelector((state: RootState) => state.authReducer.user);

    const likedAnimals = React.useMemo(
        () => new Set<number>(reduxUser?.user_prefs?.liked_animals),
        [reduxUser]
    );
    const user = React.useMemo(
        () => ({
            ...reduxUser,
            getLikedAnimals: () => likedAnimals,
        }),
        [likedAnimals, reduxUser]
    );

    return user;
};
