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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSignal } from '../../events/EventProvider';
import { SlotTypes, SlotTypesToCallbacks } from './AnimalDialog/AnimalDialog';
import { Animal } from '../../animal/animalSlice';

type Props = {};

const AnimalDataGrid = (props: Props) => {
    const animals = useSelector(shelterAnimalSelectors.selectAll);
    const editAnimalCallback: SlotTypesToCallbacks[SlotTypes.EditAnimal] =
        useSignal(SlotTypes.EditAnimal);
    const theme = useTheme();
    const isXSmall = useMediaQuery(theme.breakpoints.down('sm'));

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
                width: 70,
                getActions: (params: GridRowParams<Animal>) => [
                    <GridActionsCellItem
                        label="Edit"
                        icon={<EditIcon />}
                        onClick={() => editAnimalCallback(params.row)}
                    />,
                ],
            } as GridActionsColDef,
        ],
        [editAnimalCallback, isXSmall]
    );

    return <DataGrid rows={animals} columns={columns} autoPageSize />;
};

export default AnimalDataGrid;

/////////////////////////////////

/*
const columns: GridColDef[] = [
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
        field: 'specific_animal_kind',
        headerName: 'Breed',
        flex: 3,
    },
    {
        field: 'animal_kind',
        headerName: 'Kind',
        flex: 1,
    },
    {
        field: 'actions',
        type: 'actions',
        width: 70,
        getActions: (params: GridRowParams) => [
            <GridActionsCellItem
                label="Edit"
                icon={<EditIcon />}
                onClick={() => alert('Somethin')}
            />,
        ],
    } as GridActionsColDef,
];
*/
