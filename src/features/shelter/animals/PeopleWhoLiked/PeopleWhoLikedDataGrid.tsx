import React from 'react';
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
    GridActionsColDef,
    GridValueGetterParams,
    GridRenderCellParams,
    GridRenderEditCellParams,
    GridCellParams,
    useGridApiContext,
    GridRowId,
} from '@mui/x-data-grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import {
    setRelationStateAction,
    shelterUserAnimalRelActions,
    shelterUserAnimalRelSelectors,
} from '../userAnimalRelSlice';
import { RootState, useAppDispatch } from '../../../../store';
import { LikeStatusChip } from '../../../likedAnimals/LikedAnimalsDataGrid';
import {
    UserAnimalLikeRelation,
    UserAnimalLikeRelationState,
} from '../../../animal/animalSlice';
import { Typography } from '@mui/material';
import { useSignal } from '../../../events/EventProvider';
import { SlotTypes, SlotTypesToCallbacks } from './PeopleDialog';

type Props = {
    animalId: number;
};

const PeopleWhoLikedDataGrid = ({ animalId }: Props) => {
    const people = useSelector((state: RootState) =>
        shelterUserAnimalRelSelectors
            .selectAll(state)
            .filter((rel) => rel.animal === animalId)
    );

    const peopleDialogSignal: SlotTypesToCallbacks[SlotTypes.DetailPeople] =
        useSignal(SlotTypes.DetailPeople);

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: 'name',
                headerName: 'Name',
                flex: 1,
            },
            {
                field: 'state',
                headerName: 'Status',
                width: 120,
                renderCell: (
                    params: GridRenderCellParams<UserAnimalLikeRelation>
                ) =>
                    !params.row.is_updating ? (
                        <LikeStatusChip userRelState={params.row.state} />
                    ) : (
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress color="inherit" />
                        </Box>
                    ),
                renderEditCell: (
                    params: GridRenderEditCellParams<UserAnimalLikeRelation>
                ) => (
                    <StatusEditComponent
                        id={params.id}
                        field={params.field}
                        currentStatus={params.row.state}
                    />
                ),
                editable: true,
            },
            {
                field: 'actions',
                type: 'actions',
                width: 70,
                getActions: (params: GridRowParams<UserAnimalLikeRelation>) => [
                    <GridActionsCellItem
                        label="More"
                        icon={<MoreHorizIcon />}
                        onClick={() =>
                            peopleDialogSignal(
                                params.row.user_prefs,
                                params.row.id
                            )
                        }
                    />,
                ],
            },
        ],
        []
    );

    const isCellEditable = React.useCallback(
        (params: GridCellParams<UserAnimalLikeRelation>) =>
            !params.row.is_updating,
        []
    );

    return (
        <DataGrid
            rows={people}
            columns={columns}
            autoPageSize
            sx={{ flex: 1 }}
            experimentalFeatures={{ newEditingApi: true }}
            isCellEditable={isCellEditable}
        />
    );
};

export default PeopleWhoLikedDataGrid;

///////////////

const STATES_THAT_CAN_BE_SET = [
    UserAnimalLikeRelationState.ACCEPTED,
    UserAnimalLikeRelationState.NOT_ACCEPTED,
];

type StatusEditComponentProps = {
    id: GridRowId;
    field: string;
    currentStatus: UserAnimalLikeRelationState;
};

const StatusEditComponent = ({
    id,
    field,
    currentStatus,
}: StatusEditComponentProps) => {
    const anchorEl = React.useRef<HTMLElement>();
    const apiRef = useGridApiContext();

    const handleClose = React.useCallback(() => {
        apiRef.current.stopCellEditMode({ id, field });
    }, [apiRef, id, field]);

    const dispatch = useAppDispatch();
    const token = useSelector((state: RootState) => state.authReducer.token);

    const getHandleClick = (s: UserAnimalLikeRelationState) => () => {
        dispatch(
            setRelationStateAction({
                user_relation_id: id as number,
                state: s,
                token: token as string,
            })
        );

        handleClose();
    };

    return (
        <div>
            <LikeStatusChip userRelState={currentStatus} ref={anchorEl} />
            <Menu
                anchorEl={() => anchorEl.current as HTMLElement}
                onClose={handleClose}
                open={true}
            >
                {STATES_THAT_CAN_BE_SET.map((s) => (
                    <MenuItem key={s} onClick={getHandleClick(s)}>
                        <LikeStatusChip
                            userRelState={s}
                            data-userRelState={s}
                        />
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};
