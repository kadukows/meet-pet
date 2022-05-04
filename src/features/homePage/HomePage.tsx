import React from 'react';
import Box from '@mui/material/Box';
import styled from '@mui/system/styled';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

type Props = {};

const COLORS = ['HotPink', 'LightGreen'];

const HomePage = (props: Props) => {
    const [idx, setIdx] = React.useState(0);
    const handleClick = React.useCallback(
        () => setIdx((idx + 1) % 2),
        [idx, setIdx]
    );
    const containerRef = React.useRef(null);

    return (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="h2">Home page</Typography>
        </Box>
    );

    return (
        <React.Fragment>
            <button onClick={handleClick} style={{ marginBottom: '8px' }}>
                Click
            </button>

            <Paper
                ref={containerRef}
                sx={{
                    width: '30vw',
                    height: '30vh',
                    //position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}
            >
                <Slide
                    direction="left"
                    container={containerRef.current}
                    in={idx === 0}
                >
                    <Item color={COLORS[0]} />
                </Slide>
            </Paper>
        </React.Fragment>
    );
};

export default HomePage;

//////////////////////////

const Container = styled(Paper)(
    ({ theme }) => `
        //display: flex;
        /*
        border: 1px solid ${theme.palette.mode === 'dark' ? 'white' : 'black'};
        */
        width: 20vw;
        height: 80vh;
        //justify-content: center;
        margin-top: 8px;
        position: relative;
`
);

const Item = styled(Box)(
    ({ theme, color }) => `
        background-color: ${color ?? 'white'};
        width: 20vh;
        height: 20vh;
        //opacity: 0.5;
        //position: absolute;
    `
);
