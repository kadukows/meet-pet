import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';

import { RootState } from '../../store';
import { toggleDarkMode } from './darkThemeSlice';

interface Props {}

const DarkThemeToggler = (props: Props) => {
    const darkMode = useSelector(
        (state: RootState) => state.darkThemeProviderReducer.darkMode
    );
    const dispatch = useDispatch();

    const clicked = React.useCallback(
        () => dispatch(toggleDarkMode()),
        [dispatch]
    );

    return (
        <Button color="inherit" onClick={clicked}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
        </Button>
    );
};

export default DarkThemeToggler;
