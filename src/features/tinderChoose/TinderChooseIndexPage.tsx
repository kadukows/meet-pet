import React from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { RootState } from '../../store';
import { Animal } from '../animal/animalSlice';
import { getRequestMaker } from '../apiConnection/RequestMakerFactory';
import TinderChooseMain from './TinderChooseMain';

type Props = {};

const TinderChooseIndexPage = (props: Props) => {
    const [animal, setAnimal] = React.useState<Animal | null>(null);
    const token = useSelector((state: RootState) => state.authReducer.token);

    const fetchAnimal = React.useCallback(async () => {
        const animal = await getRequestMaker().getNextAnimalForTinderLikeChoose(
            token as string
        );
        setAnimal(animal);
    }, [setAnimal, token]);

    const nextAnimalCallback = React.useCallback(() => {
        setAnimal(null);
        fetchAnimal();
    }, [setAnimal, fetchAnimal]);

    React.useEffect(() => {
        fetchAnimal();
    }, [fetchAnimal]);

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
                <Button
                    size="large"
                    variant="contained"
                    onClick={nextAnimalCallback}
                    disabled={animal === null}
                >
                    Like
                </Button>
                <Button
                    size="large"
                    variant="contained"
                    onClick={nextAnimalCallback}
                    disabled={animal === null}
                >
                    Next
                </Button>
            </Box>
        </TinderChooseMain>
    );
};

export default TinderChooseIndexPage;
