import React from 'react';
import { useParams } from 'react-router';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { store } from '../../store';
import { Animal } from '../animal/animalSlice';
import { likeAnimal, dislikeAnimal } from '../auth/userSlice';
import { getRequestMaker } from '../apiConnection';
import { useUser } from '../useUser';
import AsyncButton from '../shelter/animals/AnimalDialog/AsyncButton';
import TinderChooseMain from '../tinderChoose/TinderChooseMain';
import { addAlert } from '../alerts/alertsSlice';

type Props = {};

type Params = {
    animalId?: string;
};

const AnimalRetrieve = (props: Props) => {
    const user = useUser();
    const params = useParams<Params>();
    const animal_id = parseInt(params.animalId ?? '');
    const [animal, setAnimal] = React.useState<Animal | null>(null);

    const fetchAnimal = React.useCallback(
        async (id: number) => {
            const fetchedAnimal = await getRequestMaker().fetchAnimal(
                store.getState().authReducer.token as string,
                id
            );

            if (fetchedAnimal !== null) {
                setAnimal(fetchedAnimal);
            }
        },
        [setAnimal]
    );

    React.useEffect(() => {
        fetchAnimal(animal_id);
    }, [animal_id, fetchAnimal]);

    const likedAnimal = user.getLikedAnimals().has(animal_id);

    const handleClick = React.useCallback(async () => {
        if (animal_id !== null) {
            const action = likedAnimal
                ? getRequestMaker().dislikeAnimal
                : getRequestMaker().likeAnimal;
            const r = await action(
                store.getState().authReducer.token as string,
                animal_id
            );

            if (r === null) {
                store.dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Something went wrong',
                    })
                );
                return;
            }

            store.dispatch(
                addAlert({
                    type: likedAnimal ? null : 'success',
                    message: `${likedAnimal ? 'Disliked' : 'Liked'} ${
                        animal?.name
                    }!`,
                })
            );

            const actionCreator = likedAnimal ? dislikeAnimal : likeAnimal;

            store.dispatch(actionCreator(animal_id));
        }
    }, [likedAnimal, animal_id, animal?.name]);

    return (
        <TinderChooseMain animal={animal}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <AsyncButton
                    variant="contained"
                    color={likedAnimal ? 'secondary' : 'primary'}
                    onClick={handleClick}
                >
                    {likedAnimal ? 'Dislike' : 'Like'}
                </AsyncButton>
            </Box>
        </TinderChooseMain>
    );
};

export default AnimalRetrieve;
