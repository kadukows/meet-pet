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
    GridRenderCellParams,
} from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {
    Animal,
    UserAnimalLikeRelation,
    UserAnimalLikeRelationState,
} from '../animal/animalSlice';
import { getRequestMaker } from '../apiConnection';
import { RootState } from '../../store';

interface AnimalWithLikeStatus {
    id: number;
    animal: Animal;
    like_status: UserAnimalLikeRelation | null;
}

const renderLikeStatus = (userRelState: UserAnimalLikeRelationState) => {
    switch (userRelState) {
        case UserAnimalLikeRelationState.LIKED:
            return <Chip color="primary" label="Liked" />;
        case UserAnimalLikeRelationState.ACCEPTED:
            return <Chip color="success" label="Accepted" />;
        case UserAnimalLikeRelationState.NOT_ACCEPTED:
            return <Chip color="error" label="Rejected" />;
    }

    return <React.Fragment />;
};

const getAnimalIdToLikeStatus = (userAnimalRels: UserAnimalLikeRelation[]) => {
    const animalIdToLikeStatus = new Map<number, UserAnimalLikeRelation>();

    for (const x of userAnimalRels) {
        animalIdToLikeStatus.set(x.animal, x);
    }

    return animalIdToLikeStatus;
};

const LikedAnimalsDataGrid = () => {
    const [animals, setAnimals] = React.useState<AnimalWithLikeStatus[]>([]);
    const token = useSelector((state: RootState) => state.authReducer.token);
    const fetchAnimals = React.useCallback(async () => {
        if (token !== null) {
            const likedAnimalsPromise = getRequestMaker().likedAnimals(token);
            const statussPromise =
                getRequestMaker().getUserAnimalRelations(token);

            const [likedAnimals, statuss] = await Promise.all([
                likedAnimalsPromise,
                statussPromise,
            ]);

            if (likedAnimals === null || statuss === null) {
                return;
            }

            const relMap = getAnimalIdToLikeStatus(statuss);

            setAnimals(
                likedAnimals.map((a) => ({
                    id: a.id,
                    animal: a,
                    like_status: relMap.get(a.id) ?? null,
                }))
            );
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
                valueGetter: (
                    params: GridValueGetterParams<AnimalWithLikeStatus>
                ) => params.row.animal.name,
            },
            ...(isXSmall
                ? []
                : [
                      {
                          field: 'specific_animal_kind',
                          headerName: 'Breed',
                          flex: 3,
                          valueGetter: (
                              params: GridValueGetterParams<AnimalWithLikeStatus>
                          ) => params.row.animal.specific_animal_kind.value,
                      },
                      {
                          field: 'animal_kind',
                          headerName: 'Kind',
                          flex: 1,
                          valueGetter: (
                              params: GridValueGetterParams<AnimalWithLikeStatus>
                          ) =>
                              params.row.animal.specific_animal_kind.animal_kind
                                  .value,
                      },
                  ]),
            {
                field: 'status',
                headerName: 'Status',
                flex: 1,
                renderCell: (
                    params: GridRenderCellParams<AnimalWithLikeStatus>
                ) => renderLikeStatus(params.row.like_status.state),
            },
            {
                field: 'actions',
                type: 'actions',
                width: 70,

                getActions: (params: GridRowParams<AnimalWithLikeStatus>) => [
                    <GridActionsCellItem
                        label="To"
                        icon={<ArrowForwardIcon />}
                        onClick={() =>
                            navigate(`/animal/${params.row.animal.id}`)
                        }
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
            sx={{ flex: 1 }}
        />
    );
};

export default LikedAnimalsDataGrid;
