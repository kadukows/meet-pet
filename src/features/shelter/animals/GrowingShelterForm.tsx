import React from 'react';
import { CSSTransition } from 'react-transition-group';

import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import './GrowingShelterForm.css';
import { useFormik } from 'formik';

interface GrowingShelterFormProps {
    dataGridRef: React.RefObject<HTMLDivElement | null>;
}

const GrowingShelterForm = ({ dataGridRef }: GrowingShelterFormProps) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = React.useState(false);

    const myDiv = React.useRef<HTMLDivElement | null>(null);

    const handleOpen = React.useCallback(() => setOpen(true), [setOpen]);
    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);

    React.useEffect(() => {
        const ref = myDiv.current;
        const dataGridDiv = dataGridRef.current;

        if (ref === null || dataGridDiv === null) {
            throw new Error("Couldn't attach listener");
        }

        ref.addEventListener('mousedown', handleOpen);
        dataGridDiv.addEventListener('mousedown', handleClose);

        return () => {
            ref.removeEventListener('mousedown', handleOpen);
            dataGridDiv.removeEventListener('mousedown', handleClose);
        };
    }, [handleOpen, handleClose, dataGridRef]);

    return !isSmall ? (
        <CSSTransition
            in={open}
            timeout={300}
            classNames="shelter-prefs-form-container"
            nodeRef={myDiv}
        >
            <Paper
                className="shelter-prefs-form-container"
                sx={{ height: '30vh' }}
                ref={myDiv}
            ></Paper>
        </CSSTransition>
    ) : (
        <Paper sx={{ height: '30vh', width: '100%' }}></Paper>
    );
};

export default GrowingShelterForm;

///////////////////////////////

const Form = () => {};
