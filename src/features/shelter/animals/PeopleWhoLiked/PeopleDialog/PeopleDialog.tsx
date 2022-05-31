import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import MuiAvatar from '@mui/material/Avatar';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { useSlot } from '../../../../events/EventProvider';
import { User } from '../../../../auth/userSlice';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../../../store';
import { getRequestMaker } from '../../../../apiConnection';
import AsyncButton from '../../AnimalDialog/AsyncButton';
import { UserAnimalLikeRelationState } from '../../../../animal/animalSlice';
import { setRelationStateAction } from '../../userAnimalRelSlice';
import Avatar, { getUserAvatarUrl } from '../../../../avatar/Avatar';
import { getFullName } from '../../../../appBar/MenuBar';

export enum SlotTypes {
    DetailPeople = 'DetailPeople',
}

export type SlotTypesToCallbacks = {
    [SlotTypes.DetailPeople]: (
        user_prefs_id: number,
        user_rel_id: number
    ) => void;
};

type Props = {};

const PeopleDialog = (props: Props) => {
    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useAppDispatch();

    const [open, setOpen] = React.useState<boolean>(false);
    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);
    const [submitting, setSubmitting] = React.useState<boolean>(false);

    const [user, setUser] = React.useState<User | null>(null);
    const [userRelId, setUserRelId] = React.useState<number | null>(null);
    const detailLookupCallback = React.useCallback<
        SlotTypesToCallbacks[SlotTypes.DetailPeople]
    >(
        async (user_prefs_id, user_rel_id) => {
            const user = await getRequestMaker().shelter.getUserByUserPrefsId(
                token as string,
                user_prefs_id
            );
            setUserRelId(user_rel_id);
            setUser(user);
            setOpen(true);
        },
        [setUser, setOpen, setUserRelId, token]
    );
    useSlot(SlotTypes.DetailPeople, detailLookupCallback);

    const acceptAsyncCallback = React.useCallback(async () => {
        setSubmitting(true);

        const updateSuccessful = await dispatch(
            setRelationStateAction({
                user_relation_id: userRelId as number,
                state: UserAnimalLikeRelationState.ACCEPTED,
                token: token as string,
            })
        ).unwrap();

        setSubmitting(false);

        if (updateSuccessful) {
            handleClose();
        }
    }, [dispatch, token, userRelId, handleClose, setSubmitting]);

    const notAcceptAsyncCallback = React.useCallback(async () => {
        setSubmitting(true);

        const updateSuccessful = await dispatch(
            setRelationStateAction({
                user_relation_id: userRelId as number,
                state: UserAnimalLikeRelationState.NOT_ACCEPTED,
                token: token as string,
            })
        ).unwrap();

        setSubmitting(false);

        if (updateSuccessful) {
            handleClose();
        }
    }, [dispatch, token, userRelId, handleClose, setSubmitting]);

    return (
        <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
            <DialogTitle>{getFullName(user)}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item sm={4} xs={12}>
                        <Avatar
                            url={getUserAvatarUrl(user)}
                            sx={{ aspectRatio: '1' }}
                        />
                        <UserTable user={user} />
                    </Grid>
                    <Grid item sm={8} xs={12}>
                        <Typography variant="h4">Description</Typography>
                        {user?.user_prefs?.description ? (
                            user?.user_prefs?.description
                        ) : (
                            <i>No description</i>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <AsyncButton
                    disabled={submitting}
                    onClick={acceptAsyncCallback}
                >
                    Accept
                </AsyncButton>
                <AsyncButton
                    disabled={submitting}
                    onClick={notAcceptAsyncCallback}
                    color="error"
                >
                    Not Accept
                </AsyncButton>
                <Button disabled={submitting} onClick={handleClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PeopleDialog;

type UserTableProps = {
    user: User | null;
};

const UserTable = ({ user }: UserTableProps) => {
    return (
        <TableContainer>
            <Table sx={{ width: '100%' }}>
                <TableBody>
                    <TableRow>
                        <TableCell>Has garden</TableCell>
                        <TableCell>
                            <Checkbox
                                disabled
                                checked={!!user?.user_prefs?.has_garden}
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
