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
import { Color } from '../colors/colorSlice';
import { useFormik } from 'formik';
import MultipleSelectChip from '../multipleSelectChip/MultipleSelectChip';
import Loader from '../loader/Loader';
import Button from '@mui/material/Button';
import { specificAnimalKindSelectors } from '../specificAnimalKind/specificAnimalKindSlice';
import { animalKindSelectors } from '../animalKind/animaKindSlice';

interface Props {}

const Preferences = (props: Props) => {
    const width = '75%';
    const height = '100%';

    const formik: any = useFormik({
        initialValues: {
            animal_kinds:
                useSelector(
                    (state: RootState) => state.authReducer.user?.liked_kinds
                ) ?? [],
            specific_animal_kinds:
                useSelector(
                    (state: RootState) =>
                        //TODO: When animal kind changed, do not display the initial liked_specific_kind
                        state.authReducer.user?.liked_specific_kinds
                ) ?? [],
            colors:
                useSelector(
                    (state: RootState) => state.authReducer.user?.liked_colors
                ) ?? [],
            characters:
                useSelector(
                    (state: RootState) =>
                        state.authReducer.user?.liked_characters
                ) ?? [],
            size:
                useSelector(
                    (state: RootState) => state.authReducer.user?.liked_sizes
                ) ?? [],
        },
        onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
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

    //is_male: boolean;
    //likes_child: boolean;
    //likes_other_animals: boolean;

    return (
        <React.Fragment>
            <form onSubmit={formik.handleSubmit}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        alignContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <h1>Change your preferences for the dreamed animal:</h1>
                    <MultipleSelectChip
                        sx={{ mt: 3, width: width, height: height }}
                        name="animal_kinds"
                        label="Animal Kind"
                        formik={formik}
                        selectorAll={animalKindSelectors.selectEntities}
                        selectObjects={animalKindSelectors.selectAll}
                    />

                    {formik.values.animal_kinds.length > 0 && (
                        <MultipleSelectChip
                            sx={{ mt: 3, width: width, height: height }}
                            name="specific_animal_kinds"
                            label="Specific Animal Kind"
                            formik={formik}
                            selectorAll={(state: RootState) =>
                                state.specificAnimalKindReducer.entities
                            }
                            selectObjects={specificAnimalKindSelectorObjects}
                        />
                    )}

                    <MultipleSelectChip
                        sx={{ mt: 3, width: width, height: height }}
                        name="colors"
                        label="Colors"
                        formik={formik}
                        selectorAll={(state: RootState) =>
                            state.colorReducer.entities
                        }
                    />
                    <MultipleSelectChip
                        sx={{ mt: 3, width: width, height: height }}
                        name="characters"
                        label="Characters"
                        formik={formik}
                        selectorAll={(state: RootState) =>
                            state.characterReducer.entities
                        }
                    />
                    <MultipleSelectChip
                        sx={{ mt: 3, width: width, height: height }}
                        name="size"
                        label="Size"
                        formik={formik}
                        selectorAll={(state: RootState) =>
                            state.sizeReducer.entities
                        }
                    />
                    <Button
                        sx={{ mt: 3, width: width, height: height }}
                        variant="contained"
                        type="submit"
                    >
                        Request!
                    </Button>
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
