import React from 'react';
import Box from '@mui/material/Box';
import Carousel from 'react-material-ui-carousel';
import { Animal } from '../animal/animalSlice';

type Props = {
    animal: Animal;
};

const AnimalCarousel = ({ animal }: Props) => {
    return (
        <Carousel
            autoPlay={false}
            sx={{ width: '100%', height: '100%' }}
            height={'calc(100% - 30px)'}
        >
            {animal.photos.map((el) => (
                <Box
                    key={el.id}
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            height: 'auto',
                            width: '100%',
                            position: 'absolute',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                width: '100%',
                            }}
                            component="img"
                            src={el.url}
                        />
                    </Box>
                    <Box
                        sx={{
                            height: '100%',
                            width: '100%',
                            flex: 1,
                            zIndex: -1,
                            position: 'absolute',
                        }}
                    >
                        <Box
                            sx={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                                filter: 'blur(15px) saturate(50%)',
                            }}
                            component="img"
                            src={el.url}
                        />
                    </Box>
                </Box>
            ))}
        </Carousel>
    );
};

export default AnimalCarousel;
