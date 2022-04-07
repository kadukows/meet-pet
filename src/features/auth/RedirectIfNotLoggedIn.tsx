import React from 'react';
import Loader from '../loader/Loader';
import { useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addAlert } from '../alerts/alertsSlice';

type Props = {};

const RedirectIfNotLoggedIn = ({
    children,
}: React.PropsWithChildren<Props>) => {
    return (
        <Loader selector={(state) => !state.authReducer.loading}>
            <Impl>{children}</Impl>
        </Loader>
    );
};

export default RedirectIfNotLoggedIn;

const Impl = ({ children }: React.PropsWithChildren<{}>) => {
    const dispatch = useDispatch();
    const authed = useSelector(
        (state: RootState) => state.authReducer.authorized
    );
    const location = useLocation();

    React.useEffect(() => {
        dispatch(
            addAlert({
                type: 'warning',
                message: 'You need to be logged in order to access this page',
            })
        );
    }, [dispatch]);

    return authed ? (
        <React.Fragment>{children}</React.Fragment>
    ) : (
        <Navigate to="/" state={{ from: location }} replace />
    );
};
