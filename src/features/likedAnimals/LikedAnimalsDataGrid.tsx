import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
    GridActionsColDef,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { Animal } from '../animal/animalSlice';
import { getRequestMaker } from '../apiConnection';
import { RootState } from '../../store';

const LikedAnimalsDataGrid = () => {
    const [animals, setAnimals] = React.useState<Animal[]>([]);
    const token = useSelector((state: RootState) => state.authReducer.token);
    const fetchAnimals = React.useCallback(async () => {
        if (token !== null) {
            const response = await getRequestMaker().likedAnimals(token);

            if (response !== null) {
                setAnimals(response);
            }
        }
    }, [setAnimals, token]);
    React.useEffect(() => {
        fetchAnimals();
    }, [fetchAnimals]);

    const theme = useTheme();
    const isXSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const navigate = useNavigate();

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: 'id',
                headerName: '#',
                width: 70,
            },
            {
                field: 'name',
                headerName: 'Name',
                flex: 1,
            },
            {
                field: 'photo',
                headerName: 'Photo',
                flex: 1,
                renderCell: (params: GridValueGetterParams<Animal>) => {
                    return (
                        <>
                            <img
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: 10,
                                }}
                                height={'60px'}
                                width={'90px'}
                                src={(params.row as Animal).photos[0].url}
                                alt={(params.row as Animal).name}
                            />
                        </>
                    );
                },
            },
            ...(isXSmall
                ? []
                : [
                      {
                          field: 'specific_animal_kind',
                          headerName: 'Breed',
                          flex: 3,
                          valueGetter: (
                              params: GridValueGetterParams<Animal>
                          ) => params.row.specific_animal_kind.value,
                      },
                      {
                          field: 'animal_kind',
                          headerName: 'Kind',
                          flex: 1,
                          valueGetter: (
                              params: GridValueGetterParams<Animal>
                          ) =>
                              (params.row as Animal).specific_animal_kind
                                  .animal_kind.value,
                      },
                  ]),
            {
                field: 'actions',
                type: 'actions',
                width: 70,

                getActions: (params: GridRowParams<Animal>) => [
                    <GridActionsCellItem
                        label="To"
                        icon={<ArrowForwardIcon />}
                        onClick={() => navigate(`/animal/${params.row.id}`)}
                    />,
                ],
            } as GridActionsColDef,
        ],
        [isXSmall, navigate]
    );

    return (
        <DataGrid
            rows={animals}
            columns={columns}
            autoPageSize
            rowHeight={65}
            sx={{ flex: 1 }}
        />
    );
};

export default LikedAnimalsDataGrid;
