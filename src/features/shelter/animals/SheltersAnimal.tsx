import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AnimalDataGrid from './AnimalDataGrid';
import AnimalDialog from './AnimalDialog';
import EventProvider from '../../events/EventProvider';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
                    <Paper sx={{ height: '100%', p: 3 }}>
                        <AnimalDataGrid />
                    </Paper>
                </Box>
                <AnimalDialog />
            </Box>
        </EventProvider>
    );
};

export default SheltersAnimal;

//////////////////////////////
