import React from 'react';
import { useNavigate } from 'react-router';

import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { styled } from '@mui/material/styles';
import { Animal } from '../animal/animalSlice';
import { useIntersectionWasInViewportOnce } from '../../helpers';

import styles from './AnimalImageListItem.module.css';

type Props = {
    animal: Animal;
    liked?: boolean;
};

const AnimalImageListItem = ({ animal, liked }: Props) => {
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
                [
                    <Img
                        src={animal.photos[0]?.url}
                        alt={animal.name}
                        loading="lazy"
                        key="k1"
                    />,
                    <ImageListItemBar
                        key="k2"
                        title={animal.name}
                        subtitle={
                            <Box sx={{ display: 'flex' }}>
                                {animal.description.slice(0, 28).concat('...')}
                                <Box sx={{ flex: 1 }} />
                            </Box>
                        }
                        actionIcon={
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                onClick={handleClick}
                            >
                                <InfoIcon />
                            </IconButton>
                        }
                    />,
                    liked && (
                        <Box
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                            key="k3"
                        >
                            <svg
                                viewBox="6 6 36 36"
                                style={{
                                    width: '1em',
                                    height: '1em',
                                    fontSize: '3.5rem',
                                }}
                            >
                                <use
                                    href="#my-favorite-svg-icon"
                                    fill="url(#skyGradient)"
                                    filter="url(#my-translate-filter) url(#my-blur-filter)"
                                >
                                    {/*TODO!*/}
                                    <param name="firstcolor" value="red" />
                                </use>
                            </svg>
                        </Box>
                    ),
                ]
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

//const MyFavoriteIcon = ()
const FAVORITE_PATH_SVG_STRING =
    'm12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
