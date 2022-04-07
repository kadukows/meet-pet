import React from 'react';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import styled from '@mui/system/styled';
import { RootState } from '../../store';

type Props = {
    selector: (state: RootState) => boolean;
};

const Loader = ({ selector, children }: React.PropsWithChildren<Props>) => {
    const value = useSelector(selector);

    return value ? (
        <React.Fragment>{children}</React.Fragment>
    ) : (
        <CenteredFullFlex>
            <CircularProgress sx={{ height: '50%' }} />
            <Typography variant="h4" component="h4">
                Loading...
            </Typography>
        </CenteredFullFlex>
    );
};

export default Loader;

const CenteredFullFlex = styled('div')`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80vh;
    flex-direction: column;
`;
