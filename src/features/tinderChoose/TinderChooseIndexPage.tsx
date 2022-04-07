import React from 'react';
import { useSelector } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import { RootState } from '../../store';
import { Animal } from '../animal/animalSlice';
import { getRequestMaker } from '../apiConnection/RequestMakerFactory';
import TinderChooseMain from './TinderChooseMain';

type Props = {};

const TinderChooseIndexPage = (props: Props) => {
    const [animal, setAnimal] = React.useState<Animal | null>(null);
    const [trigger, setTrigger] = React.useState(0);
    const token = useSelector((state: RootState) => state.authReducer.token);

    const fetchAnimal = React.useCallback(async () => {
        const animal = await getRequestMaker().getNextAnimalForTinderLikeChoose(
            token as string
        );
        setAnimal(animal);
    }, [setAnimal, token]);

    const nextAnimalCallback = React.useCallback(() => {
        setTrigger(trigger + 1);
        setAnimal(null);
        fetchAnimal();
    }, [setTrigger, trigger, setAnimal, fetchAnimal]);

    React.useEffect(() => {
        fetchAnimal();
    }, [fetchAnimal]);

    return (
        <TransitionGroup style={{ position: 'relative' }} appear enter>
            <Grow key={trigger}>
                <TinderChooseMain
                    nextAnimalCallback={nextAnimalCallback}
                    animal={animal}
                />
            </Grow>
        </TransitionGroup>
    );
};

export default TinderChooseIndexPage;
