import React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { Animal } from '../animal/animalSlice';
import { styled } from '@mui/system';

type Props = {
    animal: Animal;
};

const AnimalImageListItem = ({ animal }: Props) => {
    return (
        <ImageListItem sx={{ height: '100%', width: '100%' }}>
            <Img src={animal.photos[0].url} alt={animal.name} loading="lazy" />
            <ImageListItemBar
                title={animal.name}
                subtitle={animal.description.slice(0, 28).concat('...')}
                actionIcon={
                    <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                        <InfoIcon />
                    </IconButton>
                }
            />
        </ImageListItem>
    );
};

export default AnimalImageListItem;

//////////////

export const Img = styled('img')`
    height: 100%;
    width: 100%;
    object-fit: cover;
`;
