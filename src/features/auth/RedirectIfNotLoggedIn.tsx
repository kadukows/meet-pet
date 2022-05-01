import React from 'react';
import Loader from '../loader/Loader';
import { useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addAlert } from '../alerts/alertsSlice';
import { UserType } from './userSlice';

type Props = {
    type?: UserType;
};

const RedirectIfNotLoggedIn = ({
    type,
    children,
}: React.PropsWithChildren<Props>) => {
    return (
        <Loader selector={(state) => !state.authReducer.loading}>
            <Impl type={type}>{children}</Impl>
        </Loader>
    );
};

export default RedirectIfNotLoggedIn;

const Impl = ({ type, children }: React.PropsWithChildren<Props>) => {
    const dispatch = useDispatch();
    const { authed, user } = useSelector((state: RootState) => ({
        authed: state.authReducer.authorized,
        user: state.authReducer.user,
    }));
    const havePermission = type ? user?.user_type === type : true;

    const location = useLocation();

    React.useEffect(() => {
        if (!(authed && havePermission)) {
            dispatch(
                addAlert({
                    type: 'warning',
                    message: !authed
                        ? 'You need to be logged order to access this page'
                        : 'You dont have permission in order to access this page',
                })
            );
        }
    }, [dispatch, authed, havePermission]);

    return authed && havePermission ? (
        <React.Fragment>{children}</React.Fragment>
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    );
};
