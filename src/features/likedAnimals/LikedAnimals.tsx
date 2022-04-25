import React from 'react';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import LikedAnimalsDataGrid from './LikedAnimalsDataGrid';

type Props = {};

const LikedAnimals = (props: Props) => {
    return (
        <Paper
            sx={{
                height: '85vh',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="h4" sx={{ mb: 1 }}>
                Liked Animals
            </Typography>
            <LikedAnimalsDataGrid />
        </Paper>
    );
};

export default LikedAnimals;
