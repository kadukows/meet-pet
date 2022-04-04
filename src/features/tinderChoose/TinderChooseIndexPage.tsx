import React from 'react';
import { getRequestMaker } from '../apiConnection/RequestMakerFactory';
import TinderChooseMain from './TinderChooseMain';

type Props = {};

const TinderChooseIndexPage = (props: Props) => {
    const [animal, setAnimal] = React.useState<Animal>(null);

    const fetchAnimal = React.useCallback(async () => {
        const animal = await getRequestMaker().getNextAnimalForTinderLikeChoose(
            'null'
        );
        setAnimal(animal);
    }, [setAnimal]);

    React.useEffect(() => {
        fetchAnimal();
    }, [fetchAnimal]);

    return (
        <React.Fragment>
            <TinderChooseMain animal={animal} />
        </React.Fragment>
    );
};

export default TinderChooseIndexPage;
