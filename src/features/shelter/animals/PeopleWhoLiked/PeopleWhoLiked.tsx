import React from 'react';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { RootState } from '../../../../store';
import { shelterAnimalSelectors } from '../animalSlice';
import PeopleWhoLikedDataGrid from './PeopleWhoLikedDataGrid';
import PeopleDialog from './PeopleDialog/PeopleDialog';
import { addAlert } from '../../../alerts/alertsSlice';
import EventProvider from '../../../events/EventProvider';

type Props = {};

const PeopleWhoLiked = (props: Props) => {
    type Params = {
        animalId?: string;
    };
    const params = useParams<Params>();
    const animalId = parseInt(params?.animalId ?? '');
    const animal = useSelector((state: RootState) =>
        shelterAnimalSelectors.selectById(state, animalId)
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (isNaN(animalId)) {
            dispatch(
                addAlert({
                    type: 'warning',
                    message: `Animal with id: "${params?.animalId}" not found`,
                })
            );
            navigate('/');
        }
    }, [animalId, navigate, dispatch, params]);

    return (
        <EventProvider>
            <PeopleDialog />
            <Paper sx={{ height: '85vh', mt: 2, p: 2 }}>
                <Stack spacing={2} sx={{ height: '100%' }}>
                    <Typography variant="h3">
                        Pretendents for: {animal?.name}
                    </Typography>
                    <PeopleWhoLikedDataGrid animalId={animalId} />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default PeopleWhoLiked;
