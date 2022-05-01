import React from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, NavigateProps } from 'react-router';
import { addAlert, BaseAlert } from '../alerts/alertsSlice';

type Props = NavigateProps & {
    alert: BaseAlert;
};

const RedirectWithAlert = ({ alert, ...rest }: Props) => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(addAlert(alert));
    }, [dispatch, alert]);

    return <Navigate {...rest} />;
};

export default RedirectWithAlert;
