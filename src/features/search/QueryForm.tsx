import React from 'react';
import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MultipleSelectField from '../selectFields/MultipleSelectField';
import { animalKindSelectors } from '../animalKind/animaKindSlice';
import { RootState } from '../../store';
import {
    SpecificAnimalKind,
    specificAnimalKindSelectors,
} from '../specificAnimalKind/specificAnimalKindSlice';
import { characterSelectors } from '../characters/charcterSlice';
import { colorSelectors } from '../colors/colorSlice';
import { sizeSelectors } from '../size/sizeSlice';
import { styled } from '@mui/system';
import TernaryField, {
    Ternary,
    translateTernary,
} from '../selectFields/TernaryField';
import { AnimalQueryParams } from '../apiConnection/IRequestMaker';

type Props = {
    onQuerySubmit: (a: Omit<AnimalQueryParams, 'limit' | 'offset'>) => void;
};

const QueryForm = ({ onQuerySubmit }: Props) => {
    const formik = useFormik({
        initialValues: {
            animal_kinds: [] as number[],
            specific_animal_kinds: [] as number[],
            characters: [] as number[],
            colors: [] as number[],
            sizes: [] as number[],
            name_contains: '',
            male: Ternary.Indeterminate,
            likes_child: Ternary.Indeterminate,
            likes_other_animals: Ternary.Indeterminate,
        },
        onSubmit: (values) => {
            const result: Omit<AnimalQueryParams, 'limit' | 'offset'> = {
                animal_kind: values.animal_kinds,
                specific_animal_kind: values.specific_animal_kinds,
                characters: values.characters,
                colors: values.colors,
                size: values.sizes,
                male: translateTernary(values.male),
                likes_child: translateTernary(values.likes_child),
                likes_other_animals: translateTernary(
                    values.likes_other_animals
                ),
            };

            if (values.name_contains) {
                result.name_contains = values.name_contains;
            }

            onQuerySubmit(result);
        },
    });

    const sakFilter = React.useCallback(
        (saks: SpecificAnimalKind[]) =>
            formik.values.animal_kinds.length === 0
                ? saks
                : saks.filter(
                      (sak) =>
                          formik.values.animal_kinds.indexOf(
                              sak.animal_kind_id as never
                          ) > -1
                  ),
        [formik.values.animal_kinds]
    );

    const breedSelectorAll = React.useMemo(
        () => decorate(specificAnimalKindSelectors.selectAll, sakFilter),
        [sakFilter]
    );

    return (
        <FlexForm onSubmit={formik.handleSubmit}>
            <TextField
                name="name_contains"
                label="Name"
                value={formik.values.name_contains}
                onChange={formik.handleChange}
                fullWidth
            />
            <MultipleSelectField
                name="animal_kinds"
                label="Animal kind"
                formik={formik}
                selectAll={animalKindSelectors.selectAll}
                selectEntities={animalKindSelectors.selectEntities}
            />
            <MultipleSelectField
                name="specific_animal_kinds"
                label="Breed"
                formik={formik}
                selectAll={breedSelectorAll}
                selectEntities={specificAnimalKindSelectors.selectEntities}
            />
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
            <MultipleSelectField
                name="sizes"
                label="Size"
                formik={formik}
                selectAll={sizeSelectors.selectAll}
                selectEntities={sizeSelectors.selectEntities}
            />
            <TernaryField name="male" label="Is male?" formik={formik} />
            <TernaryField
                name="likes_child"
                label="Likes children?"
                formik={formik}
            />
            <TernaryField
                name="likes_other_animals"
                label="Likes other animals?"
                formik={formik}
            />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                }}
            >
                <Button variant="contained" size="large" type="submit">
                    Submit
                </Button>
            </Box>
        </FlexForm>
    );
};

export default QueryForm;

/////////////////////////////

type Selector<T> = (s: RootState) => T;

function decorate<T>(
    primary: Selector<T>,
    secondary: (t: T) => T
): (s: RootState) => T {
    return (s) => secondary(primary(s));
}

const FlexForm = styled('form')`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;
