import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button, { ButtonProps } from '@mui/material/Button';

import AnimalDataGrid from './AnimalDataGrid';
import EventProvider, { useSignal } from '../../events/EventProvider';
import {
    AnimalUpdateDialog,
    AddAnimalDialog,
    AnimalDeleteDialog,
    SlotTypes,
    SlotTypesToCallbacks,
} from './AnimalDialog';
import GrowingShelterForm from './GrowingShelterForm';

type Props = {};

const SheltersAnimal = (props: Props) => {
    const dataGridDivRef = React.useRef<HTMLDivElement | null>(null);

    return (
        <EventProvider>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    height: '85vh',
                    mt: 1,
                }}
            >
                <GrowingShelterForm dataGridRef={dataGridDivRef} />

                <Box sx={{ flex: 1, height: '100%' }}>
                    <Paper
                        sx={{
                            height: '100%',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                        ref={dataGridDivRef}
                    >
                        <Box sx={{ display: 'flex' }}>
                            <Typography variant="h5" component="h5">
                                Animals in shelter
                            </Typography>
                            <Box sx={{ flex: 1 }} />
                            <Button variant="contained" sx={{ mr: 2 }}>
                                Click me
                            </Button>
                            <CreateButton variant="contained">Add</CreateButton>
                        </Box>
                        <AnimalDataGrid />
                    </Paper>
                </Box>
            </Box>
            <AnimalUpdateDialog />
            <AddAnimalDialog />
            <AnimalDeleteDialog />
        </EventProvider>
    );
};

export default SheltersAnimal;

//////////////////////////////

const CreateButton = (props: ButtonProps) => {
    const createAnimalSignal: SlotTypesToCallbacks[SlotTypes.CreateAnimal] =
        useSignal(SlotTypes.CreateAnimal);

    return <Button {...props} onClick={createAnimalSignal} />;
};
