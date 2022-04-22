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
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, css, useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Animal } from '../../animal/animalSlice';
import { useSlot } from '../../events/EventProvider';
import MultipleSelectField from '../../search/MultipleSelectField';
import ControlledCheckbox from './ControlledCheckbox';
import { useSelector } from 'react-redux';
import { specificAnimalKindSelectors } from '../../specificAnimalKind/specificAnimalKindSlice';
import { characterSelectors } from '../../characters/charcterSlice';
import { colorSelectors } from '../../colors/colorSlice';
import { sizeSelectors } from '../../size/sizeSlice';
import { getRequestMaker } from '../../apiConnection';
import { RootState, store } from '../../../store';
import { addAlert } from '../../alerts/alertsSlice';
import { shelterAnimalActions, shelterAnimalSelectors } from './animalSlice';
import { Img } from '../../search/AnimalImageListItem';
import styles from './AnimalDialog.module.css';

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
            <DialogContent>
                {animal ? (
                    <Grid container spacing={2}>
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

const MarginedForm = styled('form')(
    ({ theme }) => css`
        margin-top: ${theme.spacing(1)};
        display: flex;
        gap: ${theme.spacing(2)};
        flex-direction: column;
    `
);

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

interface ImageEditProps {
    animal: Animal;
}

const ImageEdit = ({ animal }: ImageEditProps) => {
    const [selected, setSelected] = React.useState<number | null>(null);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const handleClick = React.useCallback(
        (e: React.MouseEvent<unknown>) => {
            const photoId = parseInt((e.currentTarget as any).dataset.photoid);

            if (selected === photoId) {
                setSelected(null);
            } else {
                setSelected(photoId);
            }
        },
        [selected, setSelected]
    );

    //const slideContainerRef = React.useRef<Element | null>(null);
    const [slideContainerRef, setSlideContainerRef] =
        React.useState<Element | null>(null);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: '100%',
            }}
        >
            <Typography variant="h3" component="h3">
                Photos:
            </Typography>
            <ImageList
                sx={{ width: '100%', flexShrink: '1', p: 2 }}
                cols={isSmall ? 1 : 2}
                rowHeight="auto"
            >
                {animal.photos.map((p) => (
                    <ImageListItem
                        key={p.id}
                        //sx={{ m: 1 }}
                    >
                        <Img
                            src={p.url}
                            alt="An image"
                            loading="lazy"
                            className={
                                selected === p.id ? styles.redSelectedImage : ''
                            }
                        />
                        <ImageListItemBar
                            ref={(el) => setSlideContainerRef(el as Element)}
                            sx={{
                                overflow: 'hidden',
                            }}
                            actionIcon={
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        height: '100%',
                                    }}
                                >
                                    <Slide
                                        direction="right"
                                        in={p.id === selected}
                                        container={slideContainerRef}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                display: 'flex',
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                // @ts-ignore: Custom color
                                                color="neutral"
                                                sx={{
                                                    fontSize: 12,
                                                    m: 1,
                                                    flex: 1,
                                                    whiteSpace: 'nowrap',
                                                }}
                                                size="small"
                                                onClick={handleClick}
                                                data-photoid={p.id}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{
                                                    fontSize: 12,
                                                    m: 1,
                                                    flex: 1,
                                                    whiteSpace: 'nowrap',
                                                }}
                                                size="small"
                                            >
                                                Yes, I'm sure
                                            </Button>
                                        </Box>
                                    </Slide>
                                    <Slide
                                        direction="left"
                                        in={p.id !== selected}
                                        container={slideContainerRef}
                                    >
                                        <IconButton
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.54)',
                                            }}
                                            onClick={handleClick}
                                            data-photoid={p.id}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Slide>
                                </Box>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <Grow in={selected !== null}>
                <Paper elevation={5}>
                    <Typography variant="h6">
                        Selected id: {selected}
                    </Typography>
                </Paper>
            </Grow>
            <Box sx={{ flex: 1 }} />
            <Box>
                <NewImageForm animal={animal} />
            </Box>
        </Box>
    );
};

interface NewImageFormProps {
    animal: Animal;
}

const NewImageForm = ({ animal }: NewImageFormProps) => {
    const imageInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<unknown>) => {
            e.preventDefault();
            const formData = new FormData(e.target as any);
            formData.append('animal', animal.id.toString());

            const photo = await getRequestMaker().shelter.uploadPhoto(
                store.getState().authReducer.token as string,
                formData
            );

            if (photo === null) {
                store.dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Problems with uploading a new file',
                    })
                );

                return false;
            }

            if (photo?.animal !== animal.id) {
                throw new Error("'photo?.animal !== animal.id', WTF !?");
            }

            store.dispatch(
                shelterAnimalActions.updateOne({
                    id: animal.id,
                    changes: {
                        photos: [
                            ...animal.photos,
                            { id: photo.id, url: photo.url },
                        ],
                    },
                })
            );

            store.dispatch(
                addAlert({
                    type: 'success',
                    message: 'Uploaded a file!',
                })
            );

            return false;
        },
        [animal]
    );

    return (
        <MarginedForm onSubmit={handleSubmit}>
            <FormControl>
                <Box sx={{ display: 'flex' }}>
                    <FormLabel sx={{ mr: 2 }}>Add photos:</FormLabel>
                    <input
                        id="image"
                        type="file"
                        name="file"
                        accept="image/png, image/jpeg"
                        required
                        ref={imageInputRef}
                    />
                </Box>
            </FormControl>

            <button type="submit">Submit</button>
        </MarginedForm>
    );
};
