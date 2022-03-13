import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { resetAuth, setUserTokenAuth } from './userSlice';

type Props = {
    text?: string;
};

type Dispatch = ReturnType<typeof useDispatch>;

const GetUserAtInit = (props: Props) => {
    const auth = useSelector((state: RootState) => state.authReducer);
    const dispatch = useDispatch();
    React.useEffect(() => {
        getToken(auth.token, auth.loading, dispatch);
    }, [auth.token, auth.loading, dispatch]);

    return <React.Fragment />;
};

const getToken = async (
    token: string | null,
    loading: boolean,
    dispatch: Dispatch
) => {
    if (loading && token != null) {
        // https://developer.mozilla.org/en-US/docs/Web/API/fetch#examples
        const authHeader = new Headers();
        authHeader.append('Authorization', `Bearer ${token}`);

        const res = await fetch('/users/me', {
            method: 'GET',
            headers: authHeader,
        });

        if (res.ok) {
            dispatch(
                setUserTokenAuth({
                    token,
                    user: await res.json(),
                })
            );
        } else {
            dispatch(resetAuth());
        }
    }
};

export default GetUserAtInit;
