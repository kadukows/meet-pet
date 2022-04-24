import React from 'react';
import Box from '@mui/material/Box';
import Paper, { PaperProps } from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import styled from '@mui/system/styled';
import { Animal } from '../animal/animalSlice';

import AnimalTable from './AnimalTable';
import AnimalCarousel from './AnimalCarousel';
import AnimalDescription from './AnimalDescription';

type Props = {
    animal: Animal | null;
    nextAnimalCallback?: () => void;
};

const FullViewportGrid = styled(Grid)(
    ({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        height: 50vh;
    }

    height: 100%;
`
);

const TinderChooseMain = React.forwardRef(
    ({ animal, nextAnimalCallback }: Props, ref: any) => {
        return (
            <GridFullHeight
                container
                sx={{ border: '1px solid blck', mt: 0 }}
                spacing={2}
                ref={ref}
            >
                <FullViewportGrid item sm={8} xs={12}>
                    {animal === null ? (
                        <Skeleton
                            height="calc(100% - 30px)"
                            width="100%"
                            variant="rectangular"
                        />
                    ) : (
                        <AnimalCarousel animal={animal} />
                    )}
                </FullViewportGrid>

                <Grid item sm={4} xs={12} sx={{ height: '100%' }}>
                    <Stack
                        spacing={2}
                        justifyContent="space-between"
                        direction={{ xs: 'column-reverse', sm: 'column' }}
                        sx={{ height: '100%' }}
                    >
                        <MPaper
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                //height: '40%',
                                flex: 4,
                            }}
                        >
                            <Typography variant="h4" sx={{ mb: 3 }}>
                                {animal === null ? (
                                    <Skeleton variant="text" />
                                ) : (
                                    animal.name
                                )}
                            </Typography>
                            {animal === null ? (
                                <Skeleton
                                    variant="rectangular"
                                    sx={{ flex: 1 }}
                                />
                            ) : (
                                <AnimalTable animal={animal} />
                            )}
                        </MPaper>

                        <MPaper
                            sx={{
                                flex: 4,
                            }}
                        >
                            <AnimalDescription animal={animal} />
                        </MPaper>

                        <Box sx={{ minHeight: '10%' }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    height: '100%',
                                }}
                            >
                                <Button
                                    size="large"
                                    variant="contained"
                                    onClick={nextAnimalCallback}
                                    disabled={animal === null}
                                >
                                    Like
                                </Button>
                                <Button
                                    size="large"
                                    variant="contained"
                                    onClick={nextAnimalCallback}
                                    disabled={animal === null}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </Stack>
                </Grid>
            </GridFullHeight>
        );
    }
);

export default TinderChooseMain;

const MPaper = styled((p: PaperProps) => <Paper elevation={3} {...p} />)(
    ({ theme }) => `
    padding: ${theme.spacing(2)};
    height: 100%;
    overflow: auto;
`
);

const OverflowBox = styled(Box)`
    overflow: auto;
    height: 100%;
`;

const GridFullHeight = styled(Grid)(
    ({ theme }) => `
    ${theme.breakpoints.up('sm')} {
        height: 90vh;
        > * {
            height: 100%;
        }
    }
`
);
