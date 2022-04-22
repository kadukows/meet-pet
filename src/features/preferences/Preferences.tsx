import React, { FormEvent } from 'react';
import Paper from '@mui/material/Paper';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Color, colorSelectors } from '../colors/colorSlice';
import { useFormik } from 'formik';
import Loader from '../loader/Loader';
import Button from '@mui/material/Button';
import { specificAnimalKindSelectors } from '../specificAnimalKind/specificAnimalKindSlice';
import { animalKindSelectors } from '../animalKind/animaKindSlice';
import TernaryField, {
    Ternary,
    translateTernary,
} from '../selectFields/TernaryField';
import { UserPreferencesResponse } from '../apiConnection/IRequestMaker';
import { UserPreferences } from '../auth/userSlice';
import { getRequestMaker } from '../apiConnection';
import MultipleSelectField from '../selectFields/MultipleSelectField';
import { characterSelectors } from '../characters/charcterSlice';
import { sizeSelectors } from '../size/sizeSlice';

interface Props {}

const Preferences = (props: Props) => {
    const token = useSelector((state: RootState) => state.authReducer.token);
    const formik: any = useFormik({
        initialValues: {
            animal_kinds:
                useSelector(
                    (state: RootState) =>
                        state.authReducer.user?.preferences?.animal_kind
                ) ?? [],
            specific_animal_kinds:
                useSelector(
                    (state: RootState) =>
                        //TODO: When animal kind changed, do not display the initial liked_specific_kind
                        state.authReducer.user?.preferences
                            ?.specific_animal_kind
                ) ?? [],
            colors:
                useSelector(
                    (state: RootState) =>
                        state.authReducer.user?.preferences?.colors
                ) ?? [],
            characters:
                useSelector(
                    (state: RootState) =>
                        state.authReducer.user?.preferences?.characters
                ) ?? [],
            size:
                useSelector(
                    (state: RootState) =>
                        state.authReducer.user?.preferences?.size
                ) ?? [],

            male: useSelector(
                (state: RootState) => state.authReducer.user?.preferences?.male
            ),
            likes_children: useSelector(
                (state: RootState) =>
                    state.authReducer.user?.preferences?.likes_children
            ),
            likes_other_animals: useSelector(
                (state: RootState) =>
                    state.authReducer.user?.preferences?.likes_other_animals
            ),
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
            const result: UserPreferences = {
                animal_kind: values.animal_kinds,
                specific_animal_kind: values.specific_animal_kinds,
                characters: values.characters,
                colors: values.colors,
                size: values.size,
                male: values.male,
                likes_children: values.likes_children,
                likes_other_animals: values.likes_other_animals,
            };

            getRequestMaker().setUserAnimalPreferences(token as string, result);
        },
    });

    const specificAnimalKindSelectorObjects = React.useCallback(
        (state: RootState) =>
            specificAnimalKindSelectors
                .selectAll(state)
                .filter((sak) =>
                    formik.values.animal_kinds.includes(sak.animal_kind_id)
                ),
        [formik.values.animal_kinds]
    );

    return (
        <React.Fragment>
            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            alignContent: 'center',
                            flexDirection: 'column',
                            gap: 3,
                            width: '75%',
                        }}
                    >
                        <h1>Change your preferences for the dreamed animal:</h1>
                        <MultipleSelectField
                            name="animal_kinds"
                            label="Animal Kind"
                            formik={formik}
                            selectAll={animalKindSelectors.selectAll}
                            selectEntities={animalKindSelectors.selectEntities}
                        />

                        {formik.values.animal_kinds.length > 0 && (
                            <MultipleSelectField
                                name="specific_animal_kinds"
                                label="Specific Animal Kind"
                                formik={formik}
                                selectAll={
                                    specificAnimalKindSelectors.selectAll
                                }
                                selectEntities={
                                    specificAnimalKindSelectors.selectEntities
                                }
                            />
                        )}

                        <MultipleSelectField
                            name="colors"
                            label="Colors"
                            formik={formik}
                            selectAll={colorSelectors.selectAll}
                            selectEntities={colorSelectors.selectEntities}
                        />
                        <MultipleSelectField
                            name="characters"
                            label="Characters"
                            formik={formik}
                            selectAll={characterSelectors.selectAll}
                            selectEntities={characterSelectors.selectEntities}
                        />
                        <MultipleSelectField
                            name="size"
                            label="Size"
                            formik={formik}
                            selectAll={sizeSelectors.selectAll}
                            selectEntities={sizeSelectors.selectEntities}
                        />
                        <TernaryField
                            name="male"
                            label="Male?"
                            formik={formik}
                        />
                        <TernaryField
                            name="likes_children"
                            label="Likes children?"
                            formik={formik}
                        />
                        <TernaryField
                            name="likes_other_animals"
                            label="Likes other animals?"
                            formik={formik}
                        />
                        <Button variant="contained" type="submit">
                            Request!
                        </Button>
                    </Box>
                </Box>
            </form>
        </React.Fragment>
    );
};

const check = (reducer: any) => reducer.loaded && !reducer.loading;

export default () => {
    const selector = (state: RootState) =>
        check(state.animalKindReducer) &&
        check(state.specificAnimalKindReducer) &&
        check(state.colorReducer) &&
        check(state.characterReducer) &&
        check(state.sizeReducer);

    return (
        <Loader selector={selector}>
            <Preferences />
        </Loader>
    );
};
