import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import ImageList from '@mui/material/ImageList';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Carousel from 'react-material-ui-carousel';
import styled from '@mui/system/styled';
import { Animal } from '../animal/animalSlice';
import { characterSelectors } from '../characters/charcterSlice';
import { useSelector } from 'react-redux';

type Props = {
    animal: Animal | null;
};

const TinderChooseMain = ({ animal }: Props) => {
    return (
        <GridFullHeight
            container
            sx={{ border: '1px solid blck', mt: 0 }}
            spacing={2}
        >
            <Grid item sm={8} xs={12} sx={{ height: '100%' }}>
                {/*<Skeleton variant="rectangular" width="100%" height="100%" />*/}
                {animal === null ? (
                    <Skeleton
                        height="100%"
                        width="100%"
                        variant="rectangular"
                    />
                ) : (
                    <Carousel autoPlay={false}>
                        {animal.photo_ids.map((el) => (
                            <Typography
                                sx={{
                                    height: 300,
                                    width: 300,
                                    textAlign: 'center',
                                }}
                                variant="h1"
                                key={el}
                            >
                                {el}
                            </Typography>
                        ))}
                    </Carousel>
                )}
            </Grid>
            <Grid item sm={4} xs={12} sx={{ height: '100%' }}>
                <Stack
                    spacing={2}
                    justifyContent="space-between"
                    direction={{ xs: 'column-reverse', sm: 'column' }}
                    sx={{ height: '100%' }}
                >
                    <OverflowBox sx={{ flex: 4 }}>
                        <MPaper>
                            <Typography variant="h4">
                                {animal === null ? (
                                    <Skeleton variant="text" />
                                ) : (
                                    animal.name
                                )}
                            </Typography>
                            {animal === null ? (
                                <Skeleton
                                    height="20vh"
                                    width="100%"
                                    variant="rectangular"
                                ></Skeleton>
                            ) : (
                                <AnimalTable animal={animal} />
                            )}
                        </MPaper>
                    </OverflowBox>
                    <OverflowBox sx={{ flex: 4 }}>
                        <BigPaper />
                    </OverflowBox>
                    <Box sx={{ flex: 2 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                height: '100%',
                            }}
                        >
                            <Button size="large" variant="contained">
                                Like
                            </Button>
                            <Button size="large" variant="contained">
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Stack>
            </Grid>
        </GridFullHeight>
    );
};

export default TinderChooseMain;

const content = `What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
    printing and typesetting industry. Lorem Ipsum has been the
    industry's standard dummy text ever since the 1500s, when an
    unknown printer took a galley of type and scrambled it to make a
    type specimen book. It has survived not only five centuries, but
    also the leap into electronic typesetting, remaining essentially
    unchanged. It was popularised in the 1960s with the release of
    Letraset sheets containing Lorem Ipsum passages, and more
    recently with desktop publishing software like Aldus PageMaker
    including versions of Lorem Ipsum. Why do we use it? It is a
    long established fact that a reader will be distracted by the
    readable content of a page when looking at its layout. The point
    of using Lorem Ipsum is that it has a more-or-less normal
    distribution of letters, as opposed to using 'Content here,
    content here', making it look like readable English. Many
    desktop publishing packages and web page editors now use Lorem
    Ipsum as their default model text, and a search for 'lorem
    ipsum' will uncover many web sites still in their infancy.
    Various versions have evolved over the years, sometimes by
    accident, sometimes on purpose (injected humour and the like).
    Where does it come from? Contrary to popular belief, Lorem Ipsum
    is not simply random text. It has roots in a piece of classical
    Latin literature from 45 BC, making it over 2000 years old.
    Richard McClintock, a Latin professor at Hampden-Sydney College
    in Virginia, looked up one of the more obscure Latin words,
    consectetur, from a Lorem Ipsum passage, and going through the
    cites of the word in classical literature, discovered the
    undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
    1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
    and Evil) by Cicero, written in 45 BC. This book is a treatise
    on the theory of ethics, very popular during the Renaissance.
    The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..",
    comes from a line in section 1.10.32. The standard chunk of
    Lorem Ipsum used since the 1500s is reproduced below for those
    interested. Sections 1.10.32 and 1.10.33 from "de Finibus
    Bonorum et Malorum" by Cicero are also reproduced in their exact
    original form, accompanied by English versions from the 1914
    translation by H. Rackham.;`;

const BigPaper = ({
    maxLength,
    ...rest
}: React.ComponentProps<typeof MPaper> & { maxLength?: number }) => {
    return (
        <MPaper {...rest}>
            <Typography>
                {maxLength !== undefined
                    ? content.slice(0, maxLength)
                    : content}
            </Typography>
        </MPaper>
    );
};

const MPaper = styled(Paper)(
    ({ theme }) => `
    padding: ${theme.spacing(2)};
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

interface AnimalTableProps {
    animal: Animal;
}

const AnimalTable = ({ animal }: AnimalTableProps) => {
    const characters = useSelector((state) => chara);

    return (
        <TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h6">Like children</Typography>
                        </TableCell>
                        <TableCell>
                            <Checkbox disabled checked={animal.likes_child} />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h6">
                                Like other animals
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Checkbox
                                disabled
                                checked={animal.likes_other_animals}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h6">Male</Typography>
                        </TableCell>
                        <TableCell>
                            <Checkbox disabled checked={animal.is_male} />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h6">Characters</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{characters}</Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
