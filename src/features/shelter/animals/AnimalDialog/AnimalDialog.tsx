import React from 'react';
import { useSelector } from 'react-redux';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { Animal } from '../../../animal/animalSlice';
import { useSlot } from '../../../events/EventProvider';
import { RootState, store } from '../../../../store';
import { shelterAnimalActions, shelterAnimalSelectors } from '../animalSlice';
import ImageEdit from './ImageEdit';
import { AnimalUpdateForm, AnimalAddForm } from './AnimalForm';
import { addAlert } from '../../../alerts/alertsSlice';
import { getRequestMaker } from '../../../apiConnection';
import AsyncButton from './AsyncButton';

type Props = {};

export enum SlotTypes {
    CreateAnimal = 'CreateAnimal',
    EditAnimal = 'EditAnimal',
    DeleteAnimal = 'DeleteAnimal',
}

export type SlotTypesToCallbacks = {
    [SlotTypes.EditAnimal]: (animal: Animal) => void;
    [SlotTypes.CreateAnimal]: () => void;
    [SlotTypes.DeleteAnimal]: (animal: Animal) => void;
};

export const AnimalUpdateDialog = () => {
    const [animalId, setAnimalId] = React.useState<number | null>(null);
    const animal = useSelector(
        animalId !== null
            ? (s: RootState) => shelterAnimalSelectors.selectById(s, animalId)
            : () => null
    ); // this hooks up photos updates to form
    const [open, setOpen] = React.useState(false);

    const slotCallback = React.useCallback(
        (animal: Animal) => {
            setAnimalId(animal.id);
            setOpen(true);
        },
        [setAnimalId]
    );
    useSlot(SlotTypes.EditAnimal, slotCallback);

    const handleClose = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const resetAnimal = React.useCallback(
        () => setAnimalId(null),
        [setAnimalId]
    );

    const dialogActionsRef = React.useRef<Element>(null);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            TransitionProps={{
                onExited: resetAnimal,
            }}
        >
            <DialogTitle>Edit Animal</DialogTitle>
            <DialogContent sx={{ p: 1 }}>
                {animal ? (
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item md={6} sm={12}>
                            <AnimalUpdateForm
                                dialogActionsRef={dialogActionsRef}
                                animal={animal}
                                formId={EDIT_ANIMAL_FORM}
                                onSuccesfulSubmit={handleClose}
                            />
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <ImageEdit animal={animal} />
                        </Grid>
                    </Grid>
                ) : (
                    <React.Fragment />
                )}
            </DialogContent>
            <DialogActions ref={dialogActionsRef}>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export const AnimalDeleteDialog = () => {
    const [open, setOpen] = React.useState(false);
    const [animal, setAnimal] = React.useState<Animal | null>(null);

    const slotCallback = React.useCallback(
        (animal) => {
            setAnimal(animal);
            setOpen(true);
        },
        [setAnimal, setOpen]
    );
    useSlot(SlotTypes.DeleteAnimal, slotCallback);

    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);

    const handleDeletion = React.useCallback(async () => {
        const errorAction = addAlert({
            type: 'error',
            message: "Something went wrong when removing animal's listing",
        });

        if (animal === null) {
            store.dispatch(errorAction);
            return;
        }

        const res = await getRequestMaker().shelter.deleteAnimal(
            store.getState().authReducer.token as string,
            animal.id
        );

        if (res === null) {
            store.dispatch(errorAction);
            return;
        }

        store.dispatch(
            addAlert({
                type: null,
                message: `Removed ${animal.name} listing`,
            })
        );

        store.dispatch(shelterAnimalActions.removeOne(animal.id));

        setOpen(false);
    }, [animal, setOpen]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{`Are you sure you want to remove ${animal?.name}'s listing?`}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    This will make it impossible for any user to see and like{' '}
                    <b>{animal?.name}</b>!
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <AsyncButton onClick={handleDeletion} color="error">
                    Remove
                </AsyncButton>
            </DialogActions>
        </Dialog>
    );
};

const EDIT_ANIMAL_FORM = 'editAnimalForm';
const ADD_ANIMAL_FORM = 'addAnimalForm';

export const AddAnimalDialog = () => {
    const [open, setOpen] = React.useState(false);
    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);

    const dialogActionsRef = React.useRef<Element>(null);

    const slotCallback = React.useCallback(() => setOpen(true), [setOpen]);
    useSlot(SlotTypes.CreateAnimal, slotCallback);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create Animal</DialogTitle>
            <DialogContent sx={{ p: 1 }}>
                <AnimalAddForm
                    dialogActionsRef={dialogActionsRef}
                    formId={ADD_ANIMAL_FORM}
                    onSuccessfulSubmit={handleClose}
                />
            </DialogContent>
            <DialogActions ref={dialogActionsRef}>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};
