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

export type LikeStatusChipProps = {
    userRelState: UserAnimalLikeRelationState;
};

export const LikeStatusChip = React.forwardRef(
    ({ userRelState }: LikeStatusChipProps, ref) => {
        switch (userRelState) {
            case UserAnimalLikeRelationState.LIKED:
                return <Chip color="primary" label="Liked" ref={ref as any} />;
            case UserAnimalLikeRelationState.ACCEPTED:
                return (
                    <Chip color="success" label="Accepted" ref={ref as any} />
                );
            case UserAnimalLikeRelationState.NOT_ACCEPTED:
                return <Chip color="error" label="Rejected" ref={ref as any} />;
        }

        return <div ref={ref as any} />;
    }
);

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
                ) => (
                    <LikeStatusChip
                        userRelState={params.row.like_status.state}
                    />
                ),
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
            rowHeight={65}
            sx={{ flex: 1 }}
        />
    );
};

export default LikedAnimalsDataGrid;
