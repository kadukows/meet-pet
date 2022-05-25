import React from 'react';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { colorSelectors } from '../colors/colorSlice';
import { useFormik } from 'formik';
import Loader from '../loader/Loader';
import Button from '@mui/material/Button';
import { specificAnimalKindSelectors } from '../specificAnimalKind/specificAnimalKindSlice';
import { animalKindSelectors } from '../animalKind/animaKindSlice';
import TernaryField, {
    Ternary,
    translateTernary,
    translateToTerenary as translateToTernary,
} from '../selectFields/TernaryField';
import { updateUserPreferences, UserPreferences } from '../auth/userSlice';
import { getRequestMaker } from '../apiConnection';
import MultipleSelectField from '../selectFields/MultipleSelectField';
import { characterSelectors } from '../characters/charcterSlice';
import { sizeSelectors } from '../size/sizeSlice';
import { addAlert } from '../alerts/alertsSlice';

interface Props {}

interface FormState {
    animal_kinds: number[];
    specific_animal_kinds: number[];
    colors: number[];
    characters: number[];
    size: number[];
    /////
    male: Ternary;
    likes_children: Ternary;
    likes_other_animals: Ternary;
}

const userPrefsToFormState = (x: UserPreferences): FormState => ({
    animal_kinds: x.animal_kind,
    specific_animal_kinds: x.specific_animal_kind,
    colors: x.colors,
    characters: x.characters,
    size: x.size,
    ///////////
    male: translateToTernary(x.male),
    likes_children: translateToTernary(x.likes_children),
    likes_other_animals: translateToTernary(x.likes_other_animals),
});

type UserPreferencesToSearchFor = Omit<UserPreferences, 'description'>;

const Preferences = (props: Props) => {
    const token = useSelector((state: RootState) => state.authReducer.token);
    const user_prefs = useSelector(
        (state: RootState) => state.authReducer.user?.user_prefs
    );
    const dispatch = useDispatch();

    if (!user_prefs) {
        throw new Error('No user prefs');
    }

    const formik: any = useFormik({
        initialValues: userPrefsToFormState(user_prefs),
        onSubmit: async (values, submitProps) => {
            const result: UserPreferences = {
                id: user_prefs.id,
                animal_kind: values.animal_kinds,
                specific_animal_kind: values.specific_animal_kinds,
                characters: values.characters,
                colors: values.colors,
                size: values.size,
                male: translateTernary(values.male),
                likes_children: translateTernary(values.likes_children),
                likes_other_animals: translateTernary(
                    values.likes_other_animals
                ),
                //////
                description: user_prefs.description,
                has_garden: user_prefs.has_garden,
                location: user_prefs.location,
                liked_animals: user_prefs.liked_animals,
            };

            const newUserPrefs =
                await getRequestMaker().setUserAnimalPreferences(
                    token as string,
                    result
                );

            if (newUserPrefs !== null) {
                dispatch(updateUserPreferences(newUserPrefs));
                dispatch(
                    addAlert({
                        type: 'success',
                        message: 'Updated user preferences',
                    })
                );
                submitProps.resetForm({
                    values: userPrefsToFormState(newUserPrefs),
                });
            } else {
                dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Something went wrong',
                    })
                );
                //submitProps.resetForm();
            }
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
                                    //specificAnimalKindSelectors.selectAll
                                    specificAnimalKindSelectorObjects
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
                        <Button
                            variant="contained"
                            type="submit"
                            disabled={formik.isSubmitting || !formik.dirty}
                        >
                            Request!
                        </Button>
                    </Box>
                </Box>
            </form>
        </React.Fragment>
    );
};

const check = (reducer: any) => reducer.loaded && !reducer.loading;

const ComponentWithLoader = () => {
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

export default ComponentWithLoader;
