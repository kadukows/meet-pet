import * as React from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import styled from '@mui/system/styled';
import { Animal } from '../animal/animalSlice';

interface Props {
    animal: Animal;
}

const AnimalTable = ({ animal }: Props) => {
    return (
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
                            <Typography>Like children</Typography>
                        </TableCell>
                        <TableCell>
                            <Checkbox disabled checked={animal.likes_child} />
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
                                {animal.characters.join(', ')}
                            </Typography>
                        </TableCell>
                    </DenseTableRow>
                    <DenseTableRow>
                        <TableCell>
                            <Typography>Colors</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography>{animal.colors.join(', ')}</Typography>
                        </TableCell>
                    </DenseTableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AnimalTable;

const DenseTableRow = styled(TableRow)`
    &:last-child td,
    &:last-child th {
        border: 0;
    }
`;
