import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import DarkThemeToggler from '../darkThemeProvider/DarkThemeToggler';
import { Location, useLocation } from 'react-router';
import MyDrawer from './MyDrawer';
import Login from '../auth/Login';
import MenuBar from '../menuBar/MenuBar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type Props = {};

const MyAppBar = (props: Props) => {
    const location = useLocation();
    const authed = useSelector(
        (state: RootState) =>
            state.authReducer.token != null && !state.authReducer.loading
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky">
                <Toolbar>
                    <MyDrawer />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {translateLocationPathname(location)}
                    </Typography>
                    <DarkThemeToggler />
                    {authed ? <MenuBar /> : <Login />}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default MyAppBar;

const REGEX_MAPPING = {
    Counter: /^\/counter$/,
    Home: /^\/$/,
};

const translateLocationPathname = (location: Location) => {
    for (const [k, v] of Object.entries(REGEX_MAPPING)) {
        if (location.pathname.match(v)) {
            return k;
        }
    }

    return 'translateNotFound ;<';
};
