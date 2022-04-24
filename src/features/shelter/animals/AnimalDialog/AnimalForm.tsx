import React from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSelector } from 'react-redux';

import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';

import { MarginedForm, FormikTextField } from './utils';
import ControlledCheckbox from './ControlledCheckbox';
import { shelterAnimalActions, Animal } from '../animalSlice';

import MultipleSelectField from '../../../search/MultipleSelectField';
import { specificAnimalKindSelectors } from '../../../specificAnimalKind/specificAnimalKindSlice';
import { characterSelectors } from '../../../characters/charcterSlice';
import { colorSelectors } from '../../../colors/colorSlice';
import { sizeSelectors } from '../../../size/sizeSlice';
import { getRequestMaker } from '../../../apiConnection';
import { store } from '../../../../store';
import { addAlert } from '../../../alerts/alertsSlice';

interface FormState {
    name: string;
    description: string;
    specific_animal_kind: number;
    characters: number[];
    colors: number[];
    size: number;
    male: boolean;
    likes_child: boolean;
    likes_other_animals: boolean;
}

interface AnimalBaseFormProps {
    formId: string;
    dialogActionsRef: React.RefObject<Element>;
}

interface AnimalUpdateFormProps extends AnimalBaseFormProps {
    animal: Animal;
    onSuccesfulSubmit?: () => void;
}

export const AnimalUpdateForm = ({
    animal,
    formId,
    dialogActionsRef,
    onSuccesfulSubmit,
}: AnimalUpdateFormProps) => {
    const initialValues = React.useMemo(
        () => ({
            name: animal.name,
            description: animal.description,
            specific_animal_kind: animal.specific_animal_kind.id,
            characters: animal.characters.map((ch) => ch.id),
            colors: animal.colors.map((c) => c.id),
            size: animal.size.id,
            male: animal.is_male,
            likes_child: animal.likes_child,
            likes_other_animals: animal.likes_other_animals,
        }),
        [animal]
    );

    const onSubmit = React.useCallback(
        async (values: FormState) => {
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
        [animal, onSuccesfulSubmit]
    );

    return (
        <AnimalForm
            animal={animal}
            formId={formId}
            dialogActionsRef={dialogActionsRef}
            initialValues={initialValues}
            onSubmit={onSubmit}
        />
    );
};

interface AnimalAddFormProps extends AnimalBaseFormProps {
    onSuccessfulSubmit: () => void;
}

export const AnimalAddForm = ({
    onSuccessfulSubmit,
    ...rest
}: AnimalAddFormProps) => {
    const onSubmit = React.useCallback(
        async (v: FormState) => {
            const animalResponse = await getRequestMaker().shelter.createAnimal(
                store.getState().authReducer.token as string,
                v
            );

            if (animalResponse === null) {
                store.dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Something went wrong when creating animal',
                    })
                );

                return;
            }

            store.dispatch(
                addAlert({
                    type: 'success',
                    message: `${animalResponse.name} created!`,
                })
            );

            store.dispatch(shelterAnimalActions.addOne(animalResponse));

            if (onSuccessfulSubmit !== undefined) {
                onSuccessfulSubmit();
            }
        },
        [onSuccessfulSubmit]
    );

    return <AnimalForm onSubmit={onSubmit} {...rest} />;
};

//////////////////////////////////////

interface AnimalFormProps extends AnimalBaseFormProps {
    animal?: Animal;
    onSubmit: (v: FormState) => any;
    initialValues?: FormState;
}

export const AnimalForm = ({
    animal,
    formId,
    dialogActionsRef,
    initialValues,
    onSubmit,
}: AnimalFormProps) => {
    const formik = useFormik<FormState>({
        initialValues: initialValues ?? {
            name: '',
            description: '',
            specific_animal_kind: '' as unknown as number,
            characters: [],
            colors: [],
            size: '' as unknown as number,
            male: false,
            likes_child: false,
            likes_other_animals: false,
        },
        validationSchema,
        onSubmit: onSubmit,
    });

    let saks = useSelector(specificAnimalKindSelectors.selectAll);
    if (animal) {
        saks = saks.filter(
            (sak) =>
                sak.animal_kind_id ===
                animal.specific_animal_kind.animal_kind.id
        );
    }
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

const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    description: yup.string().required().max(2048),
    specific_animal_kind: yup.number().required('Breed is required'),
    characters: yup
        .array()
        .of(yup.number().required())
        .min(1, 'You need to select one or more characters'),
    colors: yup
        .array()
        .of(yup.number().required())
        .min(1, 'You need to select one or more colors'),
    size: yup.number().required('Size is required'),
    male: yup.boolean(),
    likes_child: yup.boolean(),
    likes_other_animals: yup.boolean(),
});
