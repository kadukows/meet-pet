import React from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

type Props = {};

const PeopleDialog = (props: Props) => {
    const [animalId, setAnimalId] = React.useState<number | null>(null);

    return <div>PeopleDialog</div>;
};

export default PeopleDialog;
