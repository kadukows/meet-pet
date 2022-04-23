import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import AnimalDataGrid from './AnimalDataGrid';
import EventProvider, { useSignal } from '../../events/EventProvider';
import {
    AnimalUpdateDialog,
    AddAnimalDialog,
    AnimalDeleteDialog,
    SlotTypes,
    SlotTypesToCallbacks,
} from './AnimalDialog';

type Props = {};

const SheltersAnimal = (props: Props) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <EventProvider>
            <Box sx={{ display: 'flex', gap: 1, height: '85vh', mt: 1 }}>
                {!isSmall ? (
                    <Box sx={{ width: '20%', height: '100%' }}>
                        <Paper sx={{ height: '100%' }}></Paper>
                    </Box>
                ) : (
                    <React.Fragment />
                )}
                <Box sx={{ flex: 1, height: '100%' }}>
                    <Paper
                        sx={{
                            height: '100%',
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex' }}>
                            <Typography variant="h5" component="h5">
                                Animals in shelter
                            </Typography>
                            <Box sx={{ flex: 1 }} />
                            <CreateButton variant="contained">Add</CreateButton>
                        </Box>
                        <AnimalDataGrid />
                    </Paper>
                </Box>
                <AnimalUpdateDialog />
                <AddAnimalDialog />
                <AnimalDeleteDialog />
            </Box>
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
