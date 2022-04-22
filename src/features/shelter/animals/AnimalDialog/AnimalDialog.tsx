import React from 'react';
import ReactDOM from 'react-dom';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Animal } from '../../../animal/animalSlice';
import { useSlot } from '../../../events/EventProvider';
import MultipleSelectField from '../../../search/MultipleSelectField';
import ControlledCheckbox from './ControlledCheckbox';
import { useSelector } from 'react-redux';
import { specificAnimalKindSelectors } from '../../../specificAnimalKind/specificAnimalKindSlice';
import { characterSelectors } from '../../../characters/charcterSlice';
import { colorSelectors } from '../../../colors/colorSlice';
import { sizeSelectors } from '../../../size/sizeSlice';
import { getRequestMaker } from '../../../apiConnection';
import { RootState, store } from '../../../../store';
import { addAlert } from '../../../alerts/alertsSlice';
import { shelterAnimalActions, shelterAnimalSelectors } from '../animalSlice';

import { MarginedForm } from './utils';
import ImageEdit from './ImageEdit';

type Props = {};

export enum SlotTypes {
    EditAnimal = 'EditAnimal',
}

export type SlotTypesToCallbacks = {
    [SlotTypes.EditAnimal]: (animal: Animal) => void;
};

const AnimalDialog = (props: Props) => {
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

const EDIT_ANIMAL_FORM = 'editAnimalForm';

export default AnimalDialog;

///////////////////////

interface AnimalUpdateFormProps {
    animal: Animal;
    formId: string;
    dialogActionsRef: React.RefObject<Element>;
    onSuccesfulSubmit?: () => void;
}

const AnimalUpdateForm = ({
    animal,
    formId,
    dialogActionsRef,
    onSuccesfulSubmit,
}: AnimalUpdateFormProps) => {
    const formik = useFormik({
        initialValues: {
            name: animal.name,
            description: animal.description,
            specific_animal_kind: animal.specific_animal_kind.id,
            characters: animal.characters.map((ch) => ch.id),
            colors: animal.colors.map((c) => c.id),
            size: animal.size.id,
            male: animal.is_male,
            likes_child: animal.likes_child,
            likes_other_animals: animal.likes_other_animals,
        },
        validationSchema,
        onSubmit: async (values) => {
            const animalResponse = await getRequestMaker().shelter.updateAnimal(
                store.getState().authReducer.token as string,
                { id: animal.id, ...values }
            );

            if (animalResponse !== null) {
                store.dispatch(
                    addAlert({
                        type: 'success',
                        message: `${animalResponse.name} successfully updated!`,
                    })
                );

                const updateAnimal = {
                    id: animalResponse.id,
                    changes: animalResponse,
                };

                store.dispatch(shelterAnimalActions.updateOne(updateAnimal));

                if (onSuccesfulSubmit !== undefined) {
                    onSuccesfulSubmit();
                }
            } else {
                store.dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Something went wrong when updating animal',
                    })
                );
            }
        },
    });

    const saks = useSelector(specificAnimalKindSelectors.selectAll).filter(
        (sak) =>
            sak.animal_kind_id === animal.specific_animal_kind.animal_kind.id
    );
    const sizes = useSelector(sizeSelectors.selectAll);

    return (
        <MarginedForm id={formId} onSubmit={formik.handleSubmit}>
            <FormikTextField
                fullWidth
                name="name"
                label="Name"
                formik={formik}
            />
            <FormikTextField
                fullWidth
                multiline
                maxRows={10}
                name="description"
                label="Description"
                formik={formik}
            />
            <FormikTextField
                fullWidth
                select
                name="specific_animal_kind"
                label="Breed"
                formik={formik}
            >
                {saks.map((sak) => (
                    <MenuItem key={sak.id} value={sak.id}>
                        {sak.value}
                    </MenuItem>
                ))}
            </FormikTextField>
            <MultipleSelectField
                name="characters"
                label="Characters"
                formik={formik}
                selectAll={characterSelectors.selectAll}
                selectEntities={characterSelectors.selectEntities}
            />
            <MultipleSelectField
                name="colors"
                label="Colors"
                formik={formik}
                selectAll={colorSelectors.selectAll}
                selectEntities={colorSelectors.selectEntities}
            />
            <FormikTextField
                fullWidth
                select
                name="size"
                label="Size"
                formik={formik}
            >
                {sizes.map((size) => (
                    <MenuItem key={size.id} value={size.id}>
                        {size.value}
                    </MenuItem>
                ))}
            </FormikTextField>
            <FormGroup>
                <ControlledCheckbox
                    name="male"
                    formik={formik}
                    label="Is male"
                />
                <ControlledCheckbox
                    name="likes_child"
                    formik={formik}
                    label="Is ok with children"
                />
                <ControlledCheckbox
                    name="likes_other_animals"
                    formik={formik}
                    label="Likes other animals"
                />
            </FormGroup>
            <PortalledButton
                formId={formId}
                disabled={formik.isSubmitting || !formik.dirty}
                dialogActionsRef={dialogActionsRef}
            />
        </MarginedForm>
    );
};

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string().max(2048),
    specific_animal_kind: yup.number().required('Breed is required'),
    characters: yup
        .array()
        .of(yup.number().required())
        .min(1, 'You need to select one or more characters'),
    colors: yup
        .array()
        .of(yup.number().required())
        .min(1, 'You need to select one or more colors'),
    size: yup.number().required(),
    male: yup.boolean(),
    likes_child: yup.boolean(),
    likes_other_animals: yup.boolean(),
});

interface PortalledButtonProps {
    formId: string;
    disabled: boolean;
    dialogActionsRef: React.RefObject<Element>;
}

const PortalledButton = ({
    formId,
    disabled,
    dialogActionsRef,
}: PortalledButtonProps) => {
    const [currentRef, setCurrentRef] = React.useState<Element | null>(null);

    const propsRef = dialogActionsRef.current;

    React.useEffect(() => {
        if (currentRef !== dialogActionsRef.current) {
            setCurrentRef(dialogActionsRef.current);
        }
    }, [currentRef, dialogActionsRef, setCurrentRef, propsRef]);

    return currentRef ? (
        ReactDOM.createPortal(
            <Button type="submit" form={formId} disabled={disabled}>
                Submit
            </Button>,
            currentRef
        )
    ) : (
        <React.Fragment />
    );
};

type FormikTextFieldProps = TextFieldProps & {
    formik: any;
    name: string;
};

const FormikTextField = ({ formik, name, ...rest }: FormikTextFieldProps) => {
    return (
        <TextField
            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
            {...rest}
        />
    );
};
