import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
    GridActionsColDef,
    GridValueGetterParams,
} from '@mui/x-data-grid';

import { RootState } from '../../../../store';
import { addAlert } from '../../../alerts/alertsSlice';
import { getRequestMaker } from '../../../apiConnection';
import { NormalUser, UserPreferences } from '../../../auth/userSlice';

type Props = {
    animal_id: number;
};

const PretendentsDataGrid = ({ animal_id }: Props) => {
    const [pretedents, setPredents] = React.useState<NormalUser[]>([]);

    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const fetchUserPrefs = React.useCallback(async () => {
        const res = await getRequestMaker().shelter.fetchPretendents(
            token as string,
            animal_id
        );

        if (res === null) {
            dispatch(
                addAlert({
                    type: 'error',
                    message: 'Error fetching data',
                })
            );
            return;
        }

        setPredents(res);
    }, [animal_id, token, setPredents, dispatch]);

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: 'id',
                headerName: '#',
                width: 45,
            },
            {
                field: 'full_name',
                headerName: 'Name',
            },
        ],
        []
    );

    React.useEffect(() => {
        fetchUserPrefs();
    }, [fetchUserPrefs]);

    return <div>PretendentsDataGrid</div>;
};

export default PretendentsDataGrid;
