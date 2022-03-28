import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getRequestMaker } from '../apiConnection';
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
        const user = await getRequestMaker().getUser(token);

        if (user !== null) {
            dispatch(
                setUserTokenAuth({
                    token,
                    user,
                })
            );
        } else {
            dispatch(resetAuth());
        }
    }
};

export default GetUserAtInit;
