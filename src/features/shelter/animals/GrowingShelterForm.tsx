import React from 'react';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { CSSTransition } from 'react-transition-group';
import MapPicker from 'react-google-map-picker';

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled, css } from '@mui/material/styles';

import './GrowingShelterForm.scss';

import { FormikTextField } from './AnimalDialog/utils';
import { RootState } from '../../../store';
import { updateShelterPreferences, User } from '../../auth/userSlice';
import { getRequestMaker } from '../../apiConnection';
import { store } from '../../../store';
import { addAlert } from '../../alerts/alertsSlice';

interface GrowingShelterFormProps {
    dataGridRef: React.RefObject<HTMLDivElement | null>;
}

const GrowingShelterForm = ({ dataGridRef }: GrowingShelterFormProps) => {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = React.useState(false);
    const [fullyExpanded, setFullyExpanded] = React.useState(false);

    const myDiv = React.useRef<HTMLDivElement | null>(null);

    const handleOpen = React.useCallback(() => setOpen(true), [setOpen]);
    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);
    const handleEntered = React.useCallback(
        () => setFullyExpanded(true),
        [setFullyExpanded]
    );
    const handleExit = React.useCallback(
        () => setFullyExpanded(false),
        [setFullyExpanded]
    );

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
    });

    return !isSmall ? (
        <CSSTransition
            in={open}
            timeout={300}
            classNames="shelter-prefs-form-container"
            nodeRef={myDiv}
            onEntered={handleEntered}
            onExit={handleExit}
        >
            <Paper
                className="shelter-prefs-form-container"
                sx={{ p: 2 }}
                ref={myDiv}
            >
                <Form expanded={fullyExpanded} />
            </Paper>
        </CSSTransition>
    ) : (
        <Paper sx={{ p: 2, width: '100%' }} ref={myDiv}>
            <Form expanded={true} />
        </Paper>
    );
};

export default GrowingShelterForm;

///////////////////////////////

interface FormProps {
    expanded?: boolean;
}

const Form = ({ expanded }: FormProps) => {
    const user = useSelector((s: RootState) => s.authReducer.user) as User;

    const formik = useFormik({
        initialValues: {
            description: user.shelter_prefs?.description ?? '',
            longitude: user.shelter_prefs?.location?.longitude ?? 17.03699,
            latitude: user.shelter_prefs?.location?.latitude ?? 51.11612,
        },
        validationSchema,
        onSubmit: async (v, submitProps) => {
            const res =
                await getRequestMaker().shelter.updateShelterPreferences(
                    store.getState().authReducer.token as string,
                    {
                        id: user.shelter_prefs?.id as number,
                        description: v.description,
                        location: {
                            longitude: v.longitude,
                            latitude: v.latitude,
                        },
                    }
                );

            if (res === null) {
                store.dispatch(
                    addAlert({
                        type: 'error',
                        message: 'Something went wrong when updating data',
                    })
                );
                return;
            }

            store.dispatch(
                addAlert({
                    type: 'success',
                    message: 'Sucessfully updated informations about shelter',
                })
            );

            store.dispatch(updateShelterPreferences(res));

            submitProps.resetForm({ values: v });
        },
    });

    const [mapDefaultPickerValue, setMapDefaultPickerValue] = React.useState(
        () => ({
            lng: user.shelter_prefs?.location?.longitude ?? 17.03699,
            lat: user.shelter_prefs?.location?.latitude ?? 51.11612,
        })
    );

    const handleChangeLocation = React.useCallback(
        (lat: number, lng: number) => {
            formik.setFieldValue('latitude', lat);
            formik.setFieldValue('longitude', lng);
        },
        [formik]
    );

    const [zoom, setZoom] = React.useState(13);

    const resetLocation = React.useCallback(() => {
        const defaultValues = {
            lng: user.shelter_prefs?.location?.longitude ?? 17.03699,
            lat: user.shelter_prefs?.location?.latitude ?? 51.11612,
        };

        setMapDefaultPickerValue(defaultValues);

        formik.setFieldValue('latitude', defaultValues.lat);
        formik.setFieldValue('longitude', defaultValues.lng);
    }, [user, setMapDefaultPickerValue, formik]);

    const mapPickerStyle = React.useMemo(
        () => ({
            height: '100%',
            display: expanded ? 'block' : 'none',
        }),
        [expanded]
    );

    return (
        <MyForm onSubmit={formik.handleSubmit} sx={{ height: '100%' }}>
            <FormikTextField
                multiline
                fullWidth
                minRows={5}
                maxRows={5}
                name="description"
                label="Description"
                formik={formik}
            />
            <Box40VhIfSmall>
                {!expanded && (
                    <Skeleton
                        variant="rectangular"
                        sx={{ height: '100%' }}
                        animation={false}
                    />
                )}
                <MapPicker
                    zoom={zoom}
                    defaultLocation={mapDefaultPickerValue}
                    onChangeLocation={handleChangeLocation}
                    onChangeZoom={setZoom}
                    mapTypeId={'roadmap' as any}
                    apiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8"
                    style={mapPickerStyle}
                />
            </Box40VhIfSmall>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <FormikTextField
                    disabled
                    fullWidth
                    sx={{ flex: 1 }}
                    label="Longitude"
                    name="longitude"
                    formik={formik}
                />
                <FormikTextField
                    disabled
                    fullWidth
                    sx={{ flex: 1 }}
                    label="Latitude"
                    name="latitude"
                    formik={formik}
                />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    disabled={!expanded}
                    onClick={resetLocation}
                >
                    <Box
                        component="span"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Reset location
                    </Box>
                </Button>
                <Box sx={{ flex: 1 }} />
                <Button
                    variant="contained"
                    type="submit"
                    disabled={formik.isSubmitting || !formik.dirty || !expanded}
                >
                    Submit
                </Button>
            </Box>
        </MyForm>
    );
};

const validationSchema = yup.object({
    description: yup.string().required('Description is required'),
    longitude: yup.number(),
    latitude: yup.number(),
});

const MyForm = styled('form')(
    ({ theme }) => css`
        margin-top: ${theme.spacing(1)};
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        gap: ${theme.spacing(1)};
        height: 100%;
    `
);

const Box40VhIfSmall = styled(Box)(
    ({ theme }) => css`
        ${theme.breakpoints.down('md')} {
            height: 40vh;
        }

        ${theme.breakpoints.up('md')} {
            height: 100%;
            flex: 1;
        }
    `
);
