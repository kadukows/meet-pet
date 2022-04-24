import React from 'react';
import { useSelector } from 'react-redux';
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
        <TinderChooseMain
            nextAnimalCallback={nextAnimalCallback}
            animal={animal}
        />
    );
};

export default TinderChooseIndexPage;
