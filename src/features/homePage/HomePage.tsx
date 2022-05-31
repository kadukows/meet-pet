import React from 'react';
import Box from '@mui/material/Box';
import styled from '@mui/system/styled';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import logo from './homePageMainImage.png';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Stack from '@mui/material/Stack';
import { SocialMediaIconsReact } from 'social-media-icons-react';

type Props = {};

const Img = styled('img')`
    height: 100%;
    width: 100%;
    position: relative;
    object-fit: cover;
`;

const TextOnImage = styled('p')`
    position: absolute;
    bottom: 50%;
    font-size: 60px;
    color: #8aafff;
    font-family: Verdana;
`;

function importAll(r: any) {
    return r.keys().map(r);
}
const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
};

const HomePage = (props: Props) => {
    const images = importAll(
        require.context('./exampleAnimals', false, /\.(png|jpe?g|svg)$/)
    );
    console.log(images);

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        position: 'relative',
                        alignItems: 'center',
                        alignContent: 'center',
                        flexDirection: 'column',
                        gap: 3,
                        width: '85%',
                    }}
                >
                    <Img src={logo} alt={'Homepage'} loading="lazy" key="k1" />
                    <TextOnImage>Don't buy - adopt </TextOnImage>
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        alignContent: 'center',
                        flexDirection: 'column',
                        width: '85%',
                    }}
                >
                    <h1>About us:</h1>
                    <p>
                        A group of animals lovers willing to help them find new,
                        loving home. There are so many lonely pets in shelters
                        that struggle to find an owner. Our mission was to
                        create a portal where a shelter and potential new owner
                        can easily colaborate in order to beutify lives of both
                        the animal and the owner. We observed that there are so
                        many fantastic animals staying in shelter forever, just
                        because people are scared of unknowns - what the animal
                        needs and what type of house it requires.
                    </p>
                    <h1>We wait for you:</h1>
                    <ImageList
                        sx={{
                            gridAutoFlow: 'column',
                            gridTemplateColumns:
                                'repeat(auto-fill,minmax(160px,1fr)) !important',
                            gridAutoColumns: 'minmax(160px, 1fr)',
                            maxWidth: '75%',
                        }}
                    >
                        {images.map((image: any) => (
                            <ImageListItem>
                                <img src={image} />
                            </ImageListItem>
                        ))}
                    </ImageList>
                    <h1>Contact:</h1>
                    <Stack direction="row" spacing={2}>
                        <SocialMediaIconsReact
                            borderColor="rgba(0,0,0,0.25)"
                            icon="twitter"
                            iconColor="rgba(255,255,255,1)"
                            backgroundColor="rgba(26,166,233,1)"
                            url="https://twitter.com"
                            size="48"
                        />
                        <SocialMediaIconsReact
                            borderColor="rgba(0,0,0,0.25)"
                            icon="linkedin"
                            iconColor="rgba(255,255,255,1)"
                            backgroundColor="rgba(26,166,233,1)"
                            url="https://linkedin.com"
                            size="48"
                        />
                        <SocialMediaIconsReact
                            borderColor="rgba(0,0,0,0.25)"
                            icon="instagram"
                            iconColor="rgba(255,255,255,1)"
                            backgroundColor="rgba(26,166,233,1)"
                            url="https://instagram.com"
                            size="48"
                        />
                        <SocialMediaIconsReact
                            borderColor="rgba(0,0,0,0.25)"
                            icon="facebook"
                            iconColor="rgba(255,255,255,1)"
                            backgroundColor="rgba(26,166,233,1)"
                            url="https://facebook.com"
                            size="48"
                        />
                        <SocialMediaIconsReact
                            borderColor="rgba(0,0,0,0.25)"
                            icon="mail"
                            iconColor="rgba(255,255,255,1)"
                            backgroundColor="rgba(26,166,233,1)"
                            url="https://gmail.com"
                            size="48"
                        />
                    </Stack>
                </Box>
            </Box>
        </React.Fragment>
    );
};

export default HomePage;

//////////////////////////
