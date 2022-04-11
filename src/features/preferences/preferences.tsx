import React from 'react';
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

interface Props {}

const Preferences = (props: Props) => {
    const width = '65%';
    const height = '65%';

    const likedColors = useSelector(
        (state: RootState) => state.authReducer.user?.liked_colors
    );

    //is_male: boolean;
    //likes_child: boolean;
    //likes_other_animals: boolean;

    const formik = useFormik({
        initialValues: {
            animal_kinds: [],
            colors: likedColors ?? [],
            characters: [],
            size: [],
        },
        onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
    });

    return (
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
                <MultipleSelectChip
                    sx={{ mt: 3, width: width, height: height }}
                    name="animal_kinds"
                    label="Animal Kind"
                    formik={formik}
                    selectorAll={(state: RootState) =>
                        state.animalKindReducer.entities
                    }
                />
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
    );
};

const check = (reducer: any) => reducer.loaded && !reducer.loading;

export default () => {
    const selector = (state: RootState) =>
        check(state.colorReducer) &&
        check(state.characterReducer) &&
        check(state.animalKindReducer);

    return (
        <Loader selector={selector}>
            <Preferences />
        </Loader>
    );
};
