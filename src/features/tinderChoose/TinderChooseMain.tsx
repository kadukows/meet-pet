import React from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import styled from '@mui/system/styled';

type Props = {};

const WHOLE_VH = 85;

const TinderChooseMain = (props: Props) => {
    return (
        <Grid container spacing={1} sx={{ mt: 1 }}>
            <Grid item sm={8} xs={12}>
                <FoldingBox vh={WHOLE_VH}>
                    <BigPaper />
                </FoldingBox>
            </Grid>
            <Grid item sm={4} xs={12}>
                <ReversingGrid container spacing={1}>
                    <Grid item xs={12}>
                        <FoldingBox vh={40}>
                            <BigPaper />
                        </FoldingBox>
                    </Grid>
                    <Grid item xs={12}>
                        <FoldingBox vh={30}>
                            <BigPaper />
                        </FoldingBox>
                    </Grid>
                    <Grid item xs={12}>
                        <FoldingBox vh={15}>
                            <Paper
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    height: '100%',
                                    p: 2,
                                }}
                            >
                                <Button variant="contained">Like</Button>
                                <Button variant="contained">Next</Button>
                            </Paper>
                        </FoldingBox>
                    </Grid>
                </ReversingGrid>
            </Grid>
        </Grid>
    );
};

export default TinderChooseMain;

const BigPaper = (props: React.ComponentProps<typeof MPaper>) => {
    return (
        <MPaper {...props}>
            <Typography>
                What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the
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
                translation by H. Rackham.
            </Typography>
        </MPaper>
    );
};

type PropsWithVh<Props> = Props & {
    vh?: number;
};

const FoldingBox = styled(({ vh, ...rest }: PropsWithVh<BoxProps>) => (
    <Box {...rest} />
))(
    ({ theme, vh }) => `
        ${theme.breakpoints.up('sm')} {
            ${vh ? `height: ${vh}vh;` : ''}
        }
        overflow: auto;
    `
);

const ReversingGrid = styled(Grid)(
    ({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        flex-direction: column-reverse;
    }
`
);

const MPaper = styled(Paper)(
    ({ theme }) => `
    padding: ${theme.spacing(2)};
`
);
