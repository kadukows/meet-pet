import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import styled from '@mui/system/styled';
import { Animal } from '../animal/animalSlice';

interface Props {
    animal: Animal | null;
}

const AnimalTable = ({ animal }: Props) => {
    if (animal === null) {
        return <SkeletonTable />;
    }

    return (
        <Box>
            <TitleTypography variant="h4">{animal.name}</TitleTypography>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Prop</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <DenseTableRow>
                            <TableCell>
                                <Typography>Kind</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    {animal.specific_animal_kind.value}
                                </Typography>
                            </TableCell>
                        </DenseTableRow>
                        <DenseTableRow>
                            <TableCell>
                                <Typography>Like children</Typography>
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    disabled
                                    checked={animal.likes_child}
                                />
                            </TableCell>
                        </DenseTableRow>
                        <DenseTableRow>
                            <TableCell>
                                <Typography>Like other animals</Typography>
                            </TableCell>
                            <TableCell>
                                <Checkbox
                                    disabled
                                    checked={animal.likes_other_animals}
                                />
                            </TableCell>
                        </DenseTableRow>
                        <DenseTableRow>
                            <TableCell>
                                <Typography>Male</Typography>
                            </TableCell>
                            <TableCell>
                                <Checkbox disabled checked={animal.is_male} />
                            </TableCell>
                        </DenseTableRow>
                        <DenseTableRow>
                            <TableCell>
                                <Typography>Characters</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    {animal.characters
                                        .map((c) => c.value)
                                        .join(', ')}
                                </Typography>
                            </TableCell>
                        </DenseTableRow>
                        <DenseTableRow>
                            <TableCell>
                                <Typography>Colors</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>
                                    {animal.colors
                                        .map((c) => c.value)
                                        .join(', ')}
                                </Typography>
                            </TableCell>
                        </DenseTableRow>
                        <DenseTableRow>
                            <TableCell>
                                <Typography>Size</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{animal.size.value}</Typography>
                            </TableCell>
                        </DenseTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AnimalTable;

const DenseTableRow = styled(TableRow)`
    &:last-child td,
    &:last-child th {
        border: 0;
    }
`;

const TitleTypography = ({ children, ...rest }: TypographyProps) => (
    <Typography variant="h4" {...rest}>
        {children}
    </Typography>
);

/////////////////

const SkeletonTable = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                height: '100%',
            }}
        >
            <TitleTypography>
                <Skeleton variant="rectangular" />
            </TitleTypography>
            <Skeleton sx={{ flex: 1 }} variant="rectangular" />
        </Box>
    );
};
