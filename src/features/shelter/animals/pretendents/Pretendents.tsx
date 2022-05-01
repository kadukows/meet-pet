import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { RootState } from '../../../../store';
import { addAlert } from '../../../alerts/alertsSlice';
import { getRequestMaker } from '../../../apiConnection';
import RedirectWithAlert from '../../../auth/RedirectWithAlert';
import TinderChooseMain from '../../../tinderChoose/TinderChooseMain';
import { Animal } from '../animalSlice';
import PretendentsDataGrid from './PretendentsDataGrid';

type Props = {};

type Params = {
    animal_id?: string;
};

const Pretendents = (props: Props) => {
    const { animal_id } = useParams<Params>();
    const animal_id_parsed = animal_id ? parseInt(animal_id) : NaN;
    const [animal, setAnimal] = React.useState<Animal | null>(null);
    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const fetchAnimal = React.useCallback(
        async (animal_id_: number) => {
            const res = await getRequestMaker().fetchAnimal(
                token as string,
                animal_id_
            );
            if (res === null) {
                dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Problem with fetching animal',
                    })
                );
                return;
            }
            setAnimal(res);
        },
        [token, dispatch]
    );

    React.useEffect(() => {
        if (!isNaN(animal_id_parsed)) {
            fetchAnimal(animal_id_parsed);
        }
    }, [animal_id_parsed, fetchAnimal]);

    if (isNaN(animal_id_parsed)) {
        return (
            <RedirectWithAlert
                alert={{
                    type: 'warning',
                    message: 'Animal id not valid',
                }}
                to="/"
            />
        );
    }

    //return <PretendentsDataGrid />
    return (
        <React.Fragment>
            <TinderChooseMain animal={animal} />
        </React.Fragment>
    );
};

export default Pretendents;
