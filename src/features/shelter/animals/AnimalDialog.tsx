import React from 'react';
import ReactDOM from 'react-dom';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Animal } from '../../animal/animalSlice';
import { useSlot } from '../../events/EventProvider';

type Props = {};

export enum SlotTypes {
    EditAnimal = 'EditAnimal',
}

export type SlotTypesToCallbacks = {
    [SlotTypes.EditAnimal]: (animal: Animal) => void;
};

const AnimalDialog = (props: Props) => {
    const [animal, setAnimal] = React.useState<Animal | null>(null);
    const [open, setOpen] = React.useState(false);

    const slotCallback = React.useCallback(
        (animal: Animal) => {
            setAnimal(animal);
            setOpen(true);
        },
        [setAnimal]
    );
    useSlot(SlotTypes.EditAnimal, slotCallback);

    const handleClose = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const dialogActionsRef = React.useRef<Element>(null);

    return (
        <Dialog open={open} onClose={handleClose} sx={{ minWidth: '40vw' }}>
            <DialogTitle>Edit Animal</DialogTitle>
            <DialogContent>
                {animal ? (
                    <Form
                        dialogActionsRef={dialogActionsRef}
                        animal={animal}
                        formId={EDIT_ANIMAL_FORM}
                    />
                ) : (
                    <React.Fragment />
                )}
            </DialogContent>
            <DialogActions ref={dialogActionsRef}>
                <Button onClick={handleClose}>Cancel</Button>
                {/*
                <Button
                    type="submit"
                    form={EDIT_ANIMAL_FORM}
                    disabled={animal === null}
                >
                    Submit
                </Button>
                */}
            </DialogActions>
        </Dialog>
    );
};

const EDIT_ANIMAL_FORM = 'editAnimalForm';

export default AnimalDialog;

///////////////////////

interface FormProps {
    animal: Animal;
    formId: string;
    dialogActionsRef: React.RefObject<Element>;
}

const Form = ({ animal, formId, dialogActionsRef }: FormProps) => {
    const formik = useFormik({
        initialValues: {
            name: animal.name,
        },
        validationSchema,
        onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    });

    return (
        <MarginedForm id={formId} onSubmit={formik.handleSubmit}>
            <TextField
                fullWidth
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />
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
});

const MarginedForm = styled('form')(
    ({ theme }) => `
    margin-top: ${theme.spacing(1)}
`
);

interface PortalledButtonProps {
    formId: string;
    disabled: boolean;
    dialogActionsRef: React.RefObject<Element>;
}

const PortalledButton = React.memo(
    ({ formId, disabled, dialogActionsRef }: PortalledButtonProps) => {
        const [trigger, setTrigger] = React.useState(false);

        const currentRef = dialogActionsRef.current;

        React.useEffect(() => {
            if (currentRef === null) {
                setTrigger(true);
            }
        }, [currentRef, setTrigger]);

        return dialogActionsRef.current ? (
            ReactDOM.createPortal(
                <Button type="submit" form={formId} disabled={disabled}>
                    Submit
                </Button>,
                dialogActionsRef.current
            )
        ) : (
            <React.Fragment />
        );
    }
);
