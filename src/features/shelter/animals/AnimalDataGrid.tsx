import React from 'react';
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
    GridActionsColDef,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { shelterAnimalSelectors } from './animalSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSignal } from '../../events/EventProvider';
import { SlotTypes, SlotTypesToCallbacks } from './AnimalDialog/AnimalDialog';
import { Animal } from '../../animal/animalSlice';
import { useNavigate } from 'react-router';

type Props = {};

const AnimalDataGrid = (props: Props) => {
    const animals = useSelector(shelterAnimalSelectors.selectAll);
    const editAnimalCallback: SlotTypesToCallbacks[SlotTypes.EditAnimal] =
        useSignal(SlotTypes.EditAnimal);
    const deleteAnimalCallback: SlotTypesToCallbacks[SlotTypes.DeleteAnimal] =
        useSignal(SlotTypes.DeleteAnimal);
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
                width: 105,
                getActions: (params: GridRowParams<Animal>) => [
                    <GridActionsCellItem
                        label="pretendents"
                        icon={<PeopleIcon />}
                        onClick={() =>
                            navigate(`/shelter/pretendents/${params.id}`)
                        }
                    />,
                    <GridActionsCellItem
                        label="Edit"
                        icon={<EditIcon />}
                        onClick={() => editAnimalCallback(params.row)}
                    />,
                    <GridActionsCellItem
                        label="delete"
                        icon={<DeleteIcon />}
                        onClick={() => deleteAnimalCallback(params.row)}
                    />,
                ],
            } as GridActionsColDef,
        ],
        [editAnimalCallback, isXSmall, deleteAnimalCallback, navigate]
    );

    return <DataGrid rows={animals} columns={columns} autoPageSize />;
};

export default AnimalDataGrid;
