import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { RootState } from '../../store';
import { Animal } from '../animal/animalSlice';
import { getRequestMaker } from '../apiConnection/RequestMakerFactory';
import TinderChooseMain from './TinderChooseMain';
import { addAlert } from '../alerts/alertsSlice';
import AsyncButton from '../shelter/animals/AnimalDialog/AsyncButton';

type Props = {};

const TinderChooseIndexPage = (props: Props) => {
    const [animal, setAnimal] = React.useState<Animal | null>(null);
    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();
    const [submitting, setSubmitting] = React.useState(false);

    const fetchAnimal = React.useCallback(async () => {
        const animal = await getRequestMaker().getNextAnimalForTinderLikeChoose(
            token as string
        );
        setAnimal(animal);
    }, [setAnimal, token]);

    const nextAnimalCallback = React.useCallback(() => {
        setAnimal(null);
        setSubmitting(false);
        fetchAnimal();
    }, [setAnimal, fetchAnimal, setSubmitting]);

    const likeAnimalCallback = React.useCallback(async () => {
        const animal_id = animal?.id;

        if (animal_id === undefined) {
            return;
        }

        const r = await getRequestMaker().likeAnimal(
            token as string,
            animal_id
        );

        if (r === null) {
            dispatch(
                addAlert({
                    type: 'error',
                    message: 'Something went wrong',
                })
            );
            setSubmitting(false);
            return;
        }

        dispatch(
            addAlert({
                type: 'success',
                message: `Liked ${animal?.name}!`,
            })
        );

        nextAnimalCallback();
    }, [animal, token, nextAnimalCallback]);

    React.useEffect(() => {
        fetchAnimal();
    }, [fetchAnimal]);

    const subToTrue = React.useCallback(
        () => setSubmitting(true),
        [setSubmitting]
    );

    return (
        <TinderChooseMain animal={animal}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <AsyncButton
                    size="large"
                    variant="contained"
                    onClick={likeAnimalCallback}
                    disabled={animal === null}
                    onStart={subToTrue}
                >
                    Like
                </AsyncButton>
                <Button
                    size="large"
                    variant="contained"
                    onClick={nextAnimalCallback}
                    disabled={animal === null || submitting}
                >
                    Next
                </Button>
            </Box>
        </TinderChooseMain>
    );
};

export default TinderChooseIndexPage;
