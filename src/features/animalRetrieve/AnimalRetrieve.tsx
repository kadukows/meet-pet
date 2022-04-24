import React from 'react';
import { useParams } from 'react-router';
import { store } from '../../store';
import { Animal } from '../animal/animalSlice';
import { getRequestMaker } from '../apiConnection';

import TinderChooseMain from '../tinderChoose/TinderChooseMain';

type Props = {};

type Params = {
    animalId?: string;
};

const AnimalRetrieve = (props: Props) => {
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

    return <TinderChooseMain animal={animal} />;
};

export default AnimalRetrieve;
