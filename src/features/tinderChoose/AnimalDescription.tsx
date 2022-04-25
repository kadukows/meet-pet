import React from 'react';
import GoogleMapReact from 'google-map-react';

import Box, { BoxProps } from '@mui/material/Box';
import Paper, { PaperProps } from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Skeleton, { SkeletonProps } from '@mui/material/Skeleton';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { styled, css } from '@mui/material/styles';

import { Animal } from '../animal/animalSlice';
import { ShelterPreferences } from '../auth/userSlice';
import { getRequestMaker } from '../apiConnection';
import { store } from '../../store';
import { addAlert } from '../alerts/alertsSlice';

type Props = {
    animal?: Animal | null;
    skeletonProps?: SkeletonProps;
};

const AnimalDescription = ({ animal, skeletonProps }: Props) => {
    const [shelter, setShelter] = React.useState<ShelterPreferences | null>(
        null
    );

    const fetchAndSetShelter = React.useCallback(
        async (shelter_id: number) => {
            const shelter = await getRequestMaker().fetchShelter(
                store.getState().authReducer.token as string,
                shelter_id
            );

            if (shelter === null) {
                store.dispatch(
                    addAlert({
                        type: 'error',
                        message:
                            'Something went wrong when fetching shelter data',
                    })
                );
            } else {
                setShelter(shelter);
            }
        },
        [setShelter]
    );

    React.useEffect(() => {
        if (animal && animal.shelter) {
            fetchAndSetShelter(animal.shelter);
        }
    }, [animal, fetchAndSetShelter]);

    ///////////////////

    const [tab, setTab] = React.useState(0);
    const handleTabChange = React.useCallback(
        (e: React.SyntheticEvent, newValue: number) => setTab(newValue),
        [setTab]
    );

    if (!animal) {
        return (
            <Skeleton
                sx={{ height: '100%', width: '100%' }}
                variant="rectangular"
            />
        );
    }

    const center =
        shelter && shelter.location
            ? {
                  lat: shelter.location.latitude,
                  lng: shelter.location.longitude,
              }
            : undefined;

    return (
        <Box sx={{ width: '100%' }}>
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-around',
                }}
            >
                <Tabs value={tab} onChange={handleTabChange}>
                    <Tab label="Description" />
                    <Tab label="Shelter" disabled={shelter === null} />
                </Tabs>
            </Box>
            <TabPanel value={tab} index={0}>
                <Typography sx={{ overflow: 'auto', p: 1 }}>
                    {animal.description}
                </Typography>
            </TabPanel>
            <TabPanel value={tab} index={1}>
                <Box sx={{ overflow: 'auto', p: 1 }}>
                    <Typography>{shelter?.description}</Typography>
                    <Box sx={{ height: '30vh' }}>
                        <GoogleMapReact
                            bootstrapURLKeys={{
                                key: 'AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8',
                            }}
                            defaultCenter={center}
                            defaultZoom={13}
                        >
                            {center && (
                                // @ts-ignore
                                <LocationOnIcon
                                    lat={center.lat}
                                    lng={center.lng}
                                    sx={{
                                        fontSize: '48px',
                                        transform: 'translate(-50%, -100%)',
                                    }}
                                    color="warning"
                                    size="inherit"
                                />
                            )}
                        </GoogleMapReact>
                    </Box>
                </Box>
            </TabPanel>
        </Box>
    );
};

export default AnimalDescription;

/////////////////////////////////

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <React.Fragment>{children}</React.Fragment>}
        </div>
    );
}

type MapMarkerProps = BoxProps & {
    lat: number;
    lng: number;
};

const MapMarker = styled(({ lat, lng, ...rest }: MapMarkerProps) => (
    <Box {...rest} />
))`
    transform: translate(-50%, -100%);
`;

const CircularMapMarker = styled(MapMarker)`
    border: 5px solid ${(props) => props.theme.palette.info.main};
    border-radius: 1920px;
    background-color: ${(props) => props.theme.palette.info.light};
    opacity: 0.5;
`;

/*
const GreyMapMarker = styled(MapMarker)`
    color: white;
    background: grey;
    padding: 15px 10px;
    display: inline-flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
`;
*/
