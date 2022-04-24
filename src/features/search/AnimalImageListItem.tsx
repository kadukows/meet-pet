import React from 'react';
import { useNavigate } from 'react-router';

import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import InfoIcon from '@mui/icons-material/Info';
import { Animal } from '../animal/animalSlice';
import { styled } from '@mui/system';
import { useIntersectionWasInViewportOnce } from '../../helpers';

type Props = {
    animal: Animal;
};

const AnimalImageListItem = ({ animal }: Props) => {
    const navigate = useNavigate();
    const handleClick = React.useCallback(() => {
        navigate(`/animal/${animal.id}`);
    }, [navigate, animal.id]);

    const ref = React.useRef<Element | null>(null);
    const seen = useIntersectionWasInViewportOnce(ref);

    return (
        <ImageListItem
            sx={{ height: '100%', width: '100%', minHeight: '160px' }}
        >
            <div ref={ref as any} />
            {seen ? (
                <React.Fragment>
                    <Img
                        src={animal.photos[0]?.url}
                        alt={animal.name}
                        loading="lazy"
                    />
                    <ImageListItemBar
                        title={animal.name}
                        subtitle={animal.description.slice(0, 28).concat('...')}
                        actionIcon={
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                onClick={handleClick}
                            >
                                <InfoIcon />
                            </IconButton>
                        }
                    />
                </React.Fragment>
            ) : (
                <Skeleton
                    variant="rectangular"
                    sx={{ width: '50%', height: '192px' }}
                />
            )}
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
