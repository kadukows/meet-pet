import React from 'react';
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
    GridActionsColDef,
} from '@mui/x-data-grid';
import { useSelector } from 'react-redux';
import { shelterAnimalSelectors } from './animalSlice';
import EditIcon from '@mui/icons-material/Edit';
import { useSignal } from '../../events/EventProvider';
import { SlotTypes, SlotTypesToCallbacks } from './AnimalDialog';
import { Animal } from '../../animal/animalSlice';

type Props = {};

const AnimalDataGrid = (props: Props) => {
    const animals = useSelector(shelterAnimalSelectors.selectAll);
    const editAnimalCallback: SlotTypesToCallbacks[SlotTypes.EditAnimal] =
        useSignal(SlotTypes.EditAnimal);
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
                getActions: (params: GridRowParams<Animal>) => [
                    <GridActionsCellItem
                        label="Edit"
                        icon={<EditIcon />}
                        onClick={() => editAnimalCallback(params.row)}
                    />,
                ],
            } as GridActionsColDef,
        ],
        [editAnimalCallback]
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
